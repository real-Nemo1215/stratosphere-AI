// Shared types for the Stratosphere AI waste-detection rules engine.

export interface CloudResource {
  id: string;
  type: "ec2" | "rds" | "ebs" | "elb" | "s3" | "snapshot";
  provider: "aws" | "gcp" | "azure";
  region: string;
  name: string;
  monthlyCostUsd: number;
  metadata: Record<string, any>;
  tags?: Record<string, string>;
  createdAt: string; // ISO timestamp
}

export type Severity = "low" | "medium" | "high";

export interface Finding {
  ruleId: string;
  ruleName: string;
  resourceId: string;
  resourceType: CloudResource["type"];
  resourceName: string;
  region: string;
  severity: Severity;
  estimatedMonthlyWasteUsd: number;
  summary: string;
  suggestedAction: string;
  detectedAt: string;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  evaluate: (resource: CloudResource, now?: Date) => Finding | null;
}