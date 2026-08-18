import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeminiClient } from "./types";
import { MODEL_NAME } from "./prompt";

/**
 * Create a real Gemini client backed by @google/generative-ai.
 * Reads the API key from the caller — never from env here, so tests
 * can substitute a fake without ever touching this module.
 */
export function createGeminiClient(apiKey: string): GeminiClient {
  const genAI = new GoogleGenerativeAI(apiKey);

  return {
    async generateJson(
      systemInstruction: string,
      userPrompt: string
    ): Promise<string> {
      const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        systemInstruction,
        generationConfig: {
          temperature: 0.2, // low creativity — fixes should be deterministic
          topP: 0.9,
          responseMimeType: "application/json", // force JSON output mode
        },
      });

      const result = await model.generateContent(userPrompt);
      return result.response.text();
    },
  };
}