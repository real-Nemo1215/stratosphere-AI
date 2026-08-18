import type { CloudResource, Finding } from "../rules-engine/types";

export const MODEL_NAME = "gemini-1.5-flash-latest";

export const SYSTEM_INSTRUCTION = `You are Stratosphere AI, an expert FinOps engineer that turns cloud-waste findings into safe, reviewable fix code.

The most generic rule: try to fix each finding with the cheapest safe action.