// lib/ai-fix-engine.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// The 6 rules we are testing
const DESTRUCTIVE_ACTIONS = ['terminate', 'delete', 'drop', 'force_stop'];

interface Finding {
  type: string; // e.g., 'idle_instance'
  description: string;
  suggestedAction: string; // e.g., 'terminate'
  estimatedWaste: number;
}

interface ResourceMetadata {
  id: string;
  type: string;
  tags: string[];
}

export async function generateAiFix(finding: Finding, resource: ResourceMetadata) {
  // 1. SAFETY GUARDRAIL CHECK
  const isProduction = resource.tags.includes('production');
  const isDestructive = DESTRUCTIVE_ACTIONS.some(action => 
    finding.suggestedAction.toLowerCase().includes(action)
  );

  if (isProduction && isDestructive) {
    // Block the AI and return a hard warning
    return {
      fixCode: null,
      explanation: "WARNING: High-Risk Action Blocked. This resource is tagged as 'production'. Destructive actions cannot be auto-generated without explicit override.",
      riskLevel: "CRITICAL",
      estimatedSavings: finding.estimatedWaste
    };
  }

  // 2. BUILD THE PROMPT (If safe, or if it's a non-destructive prod action)
  const prompt = `
    You are an expert cloud FinOps engineer. 
    Analyze the following cloud waste finding and resource metadata.
    Generate a fix in the form of an AWS CLI command or Terraform snippet.
    
    Finding Type: ${finding.type}
    Description: ${finding.description}
    Suggested Action: ${finding.suggestedAction}
    Resource Tags: ${resource.tags.join(', ')}
    ${isProduction ? "NOTE: This is a PRODUCTION resource. Suggest safe, non-destructive actions only." : ""}

    Return a JSON object with:
    - fixCode: The CLI/IaC snippet
    - explanation: Plain-English explanation of the fix
    - riskLevel: "Low", "Medium", or "High"
    - estimatedSavings: Estimated monthly savings in USD
  `;

  // 3. CALL GEMINI FLASH
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON (Add safety parsing logic here as needed for your app)
    const aiResponse = JSON.parse(responseText);
    
    return {
      fixCode: aiResponse.fixCode,
      explanation: aiResponse.explanation,
      riskLevel: isProduction ? "High" : aiResponse.riskLevel, // Auto-flag prod as High risk
      estimatedSavings: aiResponse.estimatedSavings
    };
  } catch (error) {
    console.error("AI Generation Error:", error);
    return {
      fixCode: null,
      explanation: "Error generating AI fix.",
      riskLevel: "Error",
      estimatedSavings: 0
    };
  }
}
