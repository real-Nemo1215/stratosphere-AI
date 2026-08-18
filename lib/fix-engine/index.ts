import type { CloudResource, Finding } from "../rules-engine/types";
import type { GeneratedFix, GeminiClient, GeminiFixPayload } from "./types";
import { buildUserPrompt, SYSTEM_INSTRUCTION, MODEL_NAME } from "./prompt";
import { createGeminiClient } from "./gemini-client";

/**
 * Defensive JSON parser — strips markdown fences if Gemini ignored the
 * "JSON only" instruction.
 */
function safeParseJson(raw: string): GeminiFixPayload {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```$/i, "")
      .trim();
  }
  return JSON.parse(cleaned) as GeminiFixPayload;
}

/**
 * Guardrail: the AI's claimed savings can NEVER exceed what the rules
 * engine said was being wasted. Prevents the model from over-promising.
 */
function coerceFixPayload(
  payload: GeminiFixPayload,
  finding: Finding
): GeminiFixPayload {
  const cap = finding.estimatedMonthlyWasteUsd;
  const claimed = Number(payload.estimatedSavingsUsdPerMonth ?? 0);
  return {
    ...payload,
    estimatedSavingsUsdPerMonth:
      claimed > cap ? Number(cap.toFixed(2)) : Number(claimed.toFixed(2)),
  };
}

export interface GenerateFixOptions {
  client?: GeminiClient; // inject for tests
  now?: Date; // inject for deterministic timestamps
}

/**
 * Generate a fix for a single finding using Gemini Flash.
 * Pure-ish: same input + same client → same output.
 */
export async function generateFix(
  finding: Finding,
  resource: CloudResource,
  options: GenerateFixOptions = {}
): Promise<GeneratedFix> {
  const client = options.client ?? createDefaultClient();

  const userPrompt = buildUserPrompt(finding, resource);
  const raw = await client.generateJson(SYSTEM_INSTRUCTION, userPrompt);
  const payload = coerceFixPayload(safeParseJson(raw), finding);

  return {
    findingId: `${finding.resourceId}:${finding.ruleId}`,
    fixType: payload.fixType,
    snippet: payload.snippet,
    explanation: payload.explanation,
    riskLevel: payload.riskLevel,
    estimatedSavingsUsdPerMonth: payload.estimatedSavingsUsdPerMonth,
    rollbackSteps: payload.rollbackSteps,
    modelUsed: MODEL_NAME,
    generatedAt: (options.now ?? new Date()).toISOString(),
  };
}

function createDefaultClient(): GeminiClient {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Pass a { client } option for tests, or set the env var in .env.local"
    );
  }
  return createGeminiClient(apiKey);
}

export * from "./types";
export { SYSTEM_INSTRUCTION, buildUserPrompt, MODEL_NAME } from "./prompt";