import { generateFix } from "./index";
import type { GeminiClient } from "./types";
import type { CloudResource, Finding } from "../rules-engine/types";

const FIXED_NOW = new Date("2026-08-13T00:00:00.000Z");

const sampleFinding: Finding = {
  ruleId: "R-IDLE-INSTANCE",
  ruleName: "Idle Instance",
  resourceId: "i-001",
  resourceType: "ec2",
  resourceName: "web-prod-1",
  region: "us-east-1",
  severity: "high",
  estimatedMonthlyWasteUsd: 70.4,
  summary: "Idle EC2 (1.2% CPU, 0.1 MB/day net) — effectively unused.",
  suggestedAction: "Stop or terminate the instance.",
  detectedAt: "2026-08-13T00:00:00.000Z",
};

const sampleResource: CloudResource = {
  id: "i-001",
  type: "ec2",
  provider: "aws",
  region: "us-east-1",
  name: "web-prod-1",
  monthlyCostUsd: 70.4,
  metadata: { avgCpuPct: 1.2, networkOutMbPerDay: 0.1, state: "running" },
  tags: { environment: "staging" },
  createdAt: "2026-01-01T00:00:00.000Z",
};

// Capture what the engine sends to the client so we can assert on it.
let capturedSystem = "";
let capturedUser = "";

const fakeClient: GeminiClient = {
  async generateJson(systemInstruction, userPrompt) {
    capturedSystem = systemInstruction;
    capturedUser = userPrompt;
    // Deliberately over-claim savings (100 > 70.4) to test the guardrail.
    return JSON.stringify({
      fixType: "aws-cli",
      snippet:
        "# Stop the idle EC2 instance to immediately cut its monthly cost\n" +
        "aws ec2 stop-instances --instance-ids i-001 --region us-east-1",
      explanation:
        "Stops the idle EC2 instance immediately. The instance can be restarted later if traffic returns, so no data is lost.",
      riskLevel: "low",
      estimatedSavingsUsdPerMonth: 100.0,
      rollbackSteps:
        "aws ec2 start-instances --instance-ids i-001 --region us-east-1",
    });
  },
};

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("❌ FAIL:", msg);
    process.exit(1);
  }
  console.log("✅ PASS:", msg);
}

async function main() {
  const fix = await generateFix(sampleFinding, sampleResource, {
    client: fakeClient,
    now: FIXED_NOW,
  });

  // ── Output shape ──────────────────────────────────────────────
  assert(fix.findingId === "i-001:R-IDLE-INSTANCE", "findingId links finding");
  assert(fix.fixType === "aws-cli", "fixType preserved from payload");
  assert(
    fix.snippet.includes("aws ec2 stop-instances"),
    "snippet contains the AWS CLI command"
  );
  assert(
    fix.snippet.startsWith("#"),
    "snippet has a leading comment describing intent"
  );
  assert(fix.riskLevel === "low", "riskLevel preserved from payload");
  assert(
    fix.generatedAt === "2026-08-13T00:00:00.000Z",
    "generatedAt uses injected now"
  );
  assert(
    fix.modelUsed === "gemini-1.5-flash-latest",
    "modelUsed is set to gemini-1.5-flash-latest"
  );

  // ── Guardrail: AI claimed 100 but cap is 70.4 ────────────────
  assert(
    fix.estimatedSavingsUsdPerMonth === 70.4,
    `estimated savings capped to finding waste (got ${fix.estimatedSavingsUsdPerMonth})`
  );

  // ── Prompt construction ──────────────────────────────────────
  assert(
    capturedSystem.includes("Stratosphere AI"),
    "system instruction identifies as Stratosphere AI"
  );
  assert(
    capturedSystem.includes("estimatedSavingsUsdPerMonth"),
    "system instruction specifies JSON schema field"
  );
  assert(
    capturedSystem.includes("environment=production"),
    "system instruction has the production-tag guardrail"
  );
  assert(
    capturedUser.includes("R-IDLE-INSTANCE"),
    "user prompt includes the finding's ruleId"
  );
  assert(
    capturedUser.includes("web-prod-1"),
    "user prompt includes the resource name"
  );
  assert(
    capturedUser.includes("staging"),
    "user prompt includes the resource tags so AI can apply production rule"
  );

  console.log("\nGenerated fix:");
  console.log(JSON.stringify(fix, null, 2));
  console.log("\nAll fix-engine tests passed.");
}

main();