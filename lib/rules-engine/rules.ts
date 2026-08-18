import type { Rule } from "./types";

// Small helpers
const isoNow = (now?: Date) => (now ?? new Date()).toISOString();

const daysBetween = (a: Date, b: Date) =>
  Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));

const round2 = (n: number) => Number(n.toFixed(2));

// ───────────────────────────────────────────────────────────────────────────
// RULE 1 — Idle Instance (EC2 or RDS running but doing ~nothing)
// CPU < 5% AND network out < 1 MB/day → effectively unused.
// ───────────────────────────────────────────────────────────────────────────
const idleInstanceRule: Rule = {
  id: "R-IDLE-INSTANCE",
  name: "Idle Instance",
  description:
    "EC2/RDS running with very low CPU and network usage over the last 7 days.",
  evaluate: (resource, now) => {
    if (resource.type !== "ec2" && resource.type !== "rds") return null;

    const cpu = Number(resource.metadata?.avgCpuPct ?? 100);
    const net = Number(resource.metadata?.networkOutMbPerDay ?? 100);
    const state = String(resource.metadata?.state ?? "running");

    if (state !== "running") return null;
    if (cpu >= 5 || net >= 1) return null;

    return {
      ruleId: idleInstanceRule.id,
      ruleName: idleInstanceRule.name,
      resourceId: resource.id,
      resourceType: resource.type,
      resourceName: resource.name,
      region: resource.region,
      severity: "high",
      estimatedMonthlyWasteUsd: round2(resource.monthlyCostUsd),
      summary: `Idle ${resource.type.toUpperCase()} (${cpu.toFixed(1)}% CPU, ${net.toFixed(2)} MB/day net) — effectively unused.`,
      suggestedAction:
        "Stop or terminate the instance. Restart later from snapshot or autoscaling group if needed.",
      detectedAt: isoNow(now),
    };
  },
};

// ───────────────────────────────────────────────────────────────────────────
// RULE 2 — Oversized Instance
// CPU < 15% sustained AND not already smallest in family → right-size.
// ───────────────────────────────────────────────────────────────────────────
const oversizedInstanceRule: Rule = {
  id: "R-OVERSIZED-INSTANCE",
  name: "Oversized Instance",
  description:
    "EC2/RDS with sustained low CPU that can be right-sized to a cheaper type.",
  evaluate: (resource, now) => {
    if (resource.type !== "ec2" && resource.type !== "rds") return null;

    const cpu = Number(resource.metadata?.avgCpuPct ?? 100);
    const isSmallest = Boolean(resource.metadata?.isSmallestInFamily ?? false);
    const recommendedType = String(
      resource.metadata?.recommendedInstanceType ?? ""
    );
    const recommendedCost = Number(
      resource.metadata?.recommendedMonthlyCostUsd ?? 0
    );

    if (cpu >= 15) return null;
    if (isSmallest) return null;
    if (!recommendedType || recommendedCost <= 0) return null;

    const waste = resource.monthlyCostUsd - recommendedCost;
    if (waste <= 0) return null;

    return {
      ruleId: oversizedInstanceRule.id,
      ruleName: oversizedInstanceRule.name,
      resourceId: resource.id,
      resourceType: resource.type,
      resourceName: resource.name,
      region: resource.region,
      severity: "medium",
      estimatedMonthlyWasteUsd: round2(waste),
      summary: `Oversized ${resource.type.toUpperCase()} (CPU ${cpu.toFixed(
        1
      )}%). Recommend downsize to ${recommendedType}.`,
      suggestedAction: `Resize instance to ${recommendedType} during the next maintenance window.`,
      detectedAt: isoNow(now),
    };
  },
};

// ───────────────────────────────────────────────────────────────────────────
// RULE 3 — Unattached EBS Volume
// state = "available" for ≥ 7 days.
// ───────────────────────────────────────────────────────────────────────────
const unattachedVolumeRule: Rule = {
  id: "R-UNATTACHED-VOLUME",
  name: "Unattached EBS Volume",
  description: "EBS volumes sitting in 'available' state with no EC2 attached.",
  evaluate: (resource, now) => {
    if (resource.type !== "ebs") return null;

    const state = String(resource.metadata?.state ?? "in-use");
    if (state !== "available") return null;

    const unattachedDays = Number(resource.metadata?.unattachedDays ?? 0);
    if (unattachedDays < 7) return null;

    return {
      ruleId: unattachedVolumeRule.id,
      ruleName: unattachedVolumeRule.name,
      resourceId: resource.id,
      resourceType: resource.type,
      resourceName: resource.name,
      region: resource.region,
      severity: unattachedDays >= 30 ? "high" : "medium",
      estimatedMonthlyWasteUsd: round2(resource.monthlyCostUsd),
      summary: `EBS volume unattached for ${unattachedDays} days (state=available).`,
      suggestedAction:
        "Snapshot the volume and delete it. Retain the snapshot 30 days before purging.",
      detectedAt: isoNow(now),
    };
  },
};

// ───────────────────────────────────────────────────────────────────────────
// RULE 4 — Idle Load Balancer
// Zero healthy targets OR very low traffic.
// ───────────────────────────────────────────────────────────────────────────
const idleLoadBalancerRule: Rule = {
  id: "R-IDLE-ELB",
  name: "Idle Load Balancer",
  description: "ELBs with zero healthy targets or negligible traffic.",
  evaluate: (resource, now) => {
    if (resource.type !== "elb") return null;

    const healthy = Number(resource.metadata?.healthyTargets ?? 0);
    const reqPerDay = Number(resource.metadata?.requestsPerDay ?? 0);

    if (healthy > 0 && reqPerDay >= 100) return null;

    return {
      ruleId: idleLoadBalancerRule.id,
      ruleName: idleLoadBalancerRule.name,
      resourceId: resource.id,
      resourceType: resource.type,
      resourceName: resource.name,
      region: resource.region,
      severity: "medium",
      estimatedMonthlyWasteUsd: round2(resource.monthlyCostUsd),
      summary: `Idle ELB — healthy targets: ${healthy}, ~${reqPerDay.toFixed(
        0
      )} req/day.`,
      suggestedAction:
        "Delete the load balancer. Recreate from Terraform/CloudFormation if needed later.",
      detectedAt: isoNow(now),
    };
  },
};

// ───────────────────────────────────────────────────────────────────────────
// RULE 5 — Stale Snapshot
// Older than 90 days.
// ───────────────────────────────────────────────────────────────────────────
const staleSnapshotRule: Rule = {
  id: "R-STALE-SNAPSHOT",
  name: "Stale Snapshot",
  description: "EBS snapshots older than 90 days that are likely unneeded.",
  evaluate: (resource, now) => {
    if (resource.type !== "snapshot") return null;

    const reference = now ?? new Date();
    const created = new Date(resource.createdAt);
    if (isNaN(created.getTime())) return null;

    const ageDays = daysBetween(reference, created);
    if (ageDays < 90) return null;

    // Snapshots are incremental — assume only 30% of declared cost is recoverable waste.
    const waste = resource.monthlyCostUsd * 0.3;

    return {
      ruleId: staleSnapshotRule.id,
      ruleName: staleSnapshotRule.name,
      resourceId: resource.id,
      resourceType: resource.type,
      resourceName: resource.name,
      region: resource.region,
      severity: ageDays >= 365 ? "medium" : "low",
      estimatedMonthlyWasteUsd: round2(waste),
      summary: `Snapshot is ${ageDays} days old (created ${resource.createdAt.slice(
        0,
        10
      )}).`,
      suggestedAction:
        "Verify no AMI depends on it, then delete. Keep only the most recent 30-day snapshot chain.",
      detectedAt: isoNow(reference),
    };
  },
};

// ───────────────────────────────────────────────────────────────────────────
// RULE 6 — S3 Bucket With No Lifecycle Policy
// ───────────────────────────────────────────────────────────────────────────
const s3NoLifecycleRule: Rule = {
  id: "R-S3-NO-LIFECYCLE",
  name: "S3 Bucket Without Lifecycle Policy",
  description:
    "S3 buckets with no lifecycle rules — data never moves to cheaper tiers or gets cleaned up.",
  evaluate: (resource, now) => {
    if (resource.type !== "s3") return null;

    const hasLifecycle = Boolean(
      resource.metadata?.hasLifecyclePolicy ?? false
    );
    if (hasLifecycle) return null;

    const storageGb = Number(resource.metadata?.storageGb ?? 0);
    if (storageGb <= 0) return null;

    // Model: 20% of standard storage could safely move to Standard-IA or Glacier.
    // Blended saving ≈ 35% on that wastable portion.
    const wastable = storageGb * 0.2;
    const standardPerGb = 0.023; // USD/GB-month for S3 standard
    const waste = wastable * standardPerGb * 0.35;
    if (waste <= 0) return null;

    return {
      ruleId: s3NoLifecycleRule.id,
      ruleName: s3NoLifecycleRule.name,
      resourceId: resource.id,
      resourceType: resource.type,
      resourceName: resource.name,
      region: resource.region,
      severity: "medium",
      estimatedMonthlyWasteUsd: round2(waste),
      summary: `S3 bucket has no lifecycle policy; ~${storageGb}GB stored with no tiering.`,
      suggestedAction:
        "Add lifecycle rule: Standard-IA after 30 days, Glacier after 90, delete after 365 (or per data-retention policy).",
      detectedAt: isoNow(now),
    };
  },
};

export const RULES: Rule[] = [
  idleInstanceRule,
  oversizedInstanceRule,
  unattachedVolumeRule,
  idleLoadBalancerRule,
  staleSnapshotRule,
  s3NoLifecycleRule,
];

export const RULES_BY_ID: Record<string, Rule> = Object.fromEntries(
  RULES.map((r) => [r.id, r])
);