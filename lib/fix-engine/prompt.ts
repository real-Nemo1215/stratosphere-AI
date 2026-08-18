import type { CloudResource, Finding } from "../rules-engine/types";

export const MODEL_NAME = "gemini-1.5-flash-latest";

export const SYSTEM_INSTRUCTION = `You are Stratosphere AI, an expert FinOps engineer that turns cloud-waste findings into safe, reviewable fix code.

Your output MUST be a single JSON object with these exact fields:
{
  "fixType": "terraform" | "aws-cli" | "manual",
  "snippet": "<the actual fix code as a string, with a leading comment describing intent>",
  "explanation": "<2-3 sentence plain-English explanation of what the fix does and why it works>",
  "riskLevel": "low" | "medium" | "high",
  "estimatedSavingsUsdPerMonth": <number, USD/month, must be <= the finding's waste>,
  "rollbackSteps": "<one-line description of how to undo this fix>"
}

Rules you MUST follow:
1. Always pick the cheapest, safest fix that resolves the finding.
2. Prefer AWS CLI snippets unless the resource tags indicate Terraform is in use.
3. NEVER propose destructive commands (terminate, delete, force-delete) on a resource tagged environment=production without setting riskLevel to "high" and explicitly warning in the explanation.
4. estimatedSavingsUsdPerMonth must be <= the finding's estimatedMonthlyWasteUsd.
5. Output JSON only — no markdown fences, no commentary, no prose outside the JSON object.`;

export function buildUserPrompt(finding: Finding, resource: CloudResource): string {
  return [
    "Generate a fix for this cloud-waste finding.",
    "",
    "FINDING:",
    JSON.stringify(finding, null, 2),
    "",
    "RESOURCE:",
    JSON.stringify(
      {
        id: resource.id,
        type: resource.type,
        provider: resource.provider,
        region: resource.region,
        name: resource.name,
        monthlyCostUsd: resource.monthlyCostUsd,
        metadata: resource.metadata,
        tags: resource.tags ?? {},
        createdAt: resource.createdAt,
      },
      null,
      2
    ),
    "",
    "Return only the JSON object.",
  ].join("\n");
}