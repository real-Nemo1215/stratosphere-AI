import { scanAccount, totalEstimatedWaste } from "./index";
import type { CloudResource } from "./types";

const FIXED_NOW = new Date("2026-08-13T00:00:00.000Z");

const sampleResources: CloudResource[] = [
  // 1) Idle EC2 → R-IDLE-INSTANCE
  {
    id: "i-001",
    type: "ec2",
    provider: "aws",
    region: "us-east-1",
    name: "web-prod-1",
    monthlyCostUsd: 70.4,
    metadata: { avgCpuPct: 1.2, networkOutMbPerDay: 0.1, state: "running" },
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  // 2) Oversized EC2 → R-OVERSIZED-INSTANCE
  {
    id: "i-002",
    type: "ec2",
    provider: "aws",
    region: "us-east-1",
    name: "worker-large",
    monthlyCostUsd: 140.8,
    metadata: {
      avgCpuPct: 8,
      isSmallestInFamily: false,
      recommendedInstanceType: "t3.medium",
      recommendedMonthlyCostUsd: 30.37,
    },
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  // 3) Unattached EBS (45 days) → R-UNATTACHED-VOLUME (high severity)
  {
    id: "vol-001",
    type: "ebs",
    provider: "aws",
    region: "us-east-1",
    name: "orphan-disk-1",
    monthlyCostUsd: 10.0,
    metadata: { state: "available", unattachedDays: 45 },
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  // 4) Idle ELB → R-IDLE-ELB
  {
    id: "elb-001",
    type: "elb",
    provider: "aws",
    region: "us-east-1",
    name: "legacy-alb",
    monthlyCostUsd: 18.0,
    metadata: { healthyTargets: 0, requestsPerDay: 3 },
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  // 5) Stale snapshot → R-STALE-SNAPSHOT
  {
    id: "snap-001",
    type: "snapshot",
    provider: "aws",
    region: "us-east-1",
    name: "old-backup-2024",
    monthlyCostUsd: 5.0,
    metadata: {},
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  // 6) S3 with no lifecycle → R-S3-NO-LIFECYCLE
  {
    id: "bucket-001",
    type: "s3",
    provider: "aws",
    region: "us-east-1",
    name: "logs-archive",
    monthlyCostUsd: 0,
    metadata: { hasLifecyclePolicy: false, storageGb: 1000 },
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  // 7) Healthy EC2 → no findings
  {
    id: "i-003",
    type: "ec2",
    provider: "aws",
    region: "us-east-1",
    name: "healthy-server",
    monthlyCostUsd: 70.4,
    metadata: { avgCpuPct: 42, networkOutMbPerDay: 500, state: "running" },
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("❌ FAIL:", msg);
    process.exit(1);
  }
  console.log("✅ PASS:", msg);
}

const findings = scanAccount(sampleResources, FIXED_NOW);

assert(findings.length === 6, `expected 6 findings, got ${findings.length}`);

assert(
  findings[0].estimatedMonthlyWasteUsd >=
    findings[findings.length - 1].estimatedMonthlyWasteUsd,
  "findings sorted by waste descending"
);

const ruleIds = new Set(findings.map((f) => f.ruleId));
assert(ruleIds.has("R-IDLE-INSTANCE"), "idle instance rule fired");
assert(ruleIds.has("R-OVERSIZED-INSTANCE"), "oversized instance rule fired");
assert(ruleIds.has("R-UNATTACHED-VOLUME"), "unattached volume rule fired");
assert(ruleIds.has("R-IDLE-ELB"), "idle ELB rule fired");
assert(ruleIds.has("R-STALE-SNAPSHOT"), "stale snapshot rule fired");
assert(ruleIds.has("R-S3-NO-LIFECYCLE"), "S3 no-lifecycle rule fired");

const total = totalEstimatedWaste(findings);
console.log(`\nEstimated total monthly waste: $${total}`);
console.log("\nFindings:");
for (const f of findings) {
  console.log(
    `  [${f.severity.toUpperCase().padEnd(6)}] $${f.estimatedMonthlyWasteUsd
      .toString()
      .padStart(7)} /mo  ${f.ruleName.padEnd(30)} →  ${f.resourceName}`
  );
}

console.log("\nAll rules-engine tests passed.");