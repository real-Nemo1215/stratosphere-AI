import type { CloudResource, Finding } from "../rules-engine/types";

export type FixType = "terraform" | "aws-cli" | "manual";
export type RiskLevel = "low" | "medium" | "high";

// The final, hardened object the rest of the app works with.
export interface GeneratedFix {
  findingId: string; // "<resourceId>:<ruleId>" — links back to the finding
  fixType: FixType;
  snippet: string; // the actual code an engineer pastes
  explanation: string; // 2-3 sentence plain-English summary
  riskLevel: RiskLevel;
  estimatedSavingsUsdPerMonth: number; // capped at the finding's waste
  rollbackSteps: string; // how to undo this fix
  modelUsed: string;
  generatedAt: string; // ISO timestamp
}

// The raw shape we ask Gemini to return.
export interface GeminiFixPayload {
  fixType: FixType;
  snippet: string;
  explanation: string;
  riskLevel: RiskLevel;
  estimatedSavingsUsdPerMonth: number;
  rollbackSteps: string;
}

// Interface so tests can inject a fake client (no API key needed for tests).
export interface GeminiClient {
  generateJson(systemInstruction: string, userPrompt: string): Promise<string>;
}