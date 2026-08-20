// lib/ai-fix-engine.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Finding, CloudResource } from './rules-engine';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const DESTRUCTIVE_ACTIONS = ['terminate', 'delete', 'drop', 'force_stop'];

export async function generateAiFix(finding: Finding, resource: CloudResource) {
  const isProduction = resource.tags.includes('production');
  const isDestructive = DESTRUCTIVE_ACTIONS.some(action => 
    finding.suggestedAction.toLowerCase().includes(action)
  );

  if (isProduction && isDestructive) {
    return {
      fixCode: null,
      explanation: "WARNING: High-Risk Action Blocked. This resource is tagged as 'production'. Destructive actions cannot be auto-generated without explicit override.",
      riskLevel: "CRITICAL",
      estimatedSavings: finding.estimatedWaste
    };
  }

  // Hardened: Strict system instruction and explicit JSON formatting
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are an expert cloud FinOps engineer. You analyze cloud waste findings and generate exact fixes. You MUST respond ONLY with a valid JSON object, no markdown formatting, no backticks. The JSON object must contain exactly these keys: 'fixCode' (string), 'explanation' (string), 'riskLevel' (string: 'Low', 'Medium', 'High'), 'estimatedSavings' (number)."
  });

  const prompt = `
    Analyze the following cloud waste finding and resource metadata.
    
    Finding:
    - Type: ${finding.ruleType}
    - Description: ${finding.description}
    - Suggested Action: ${finding.suggestedAction}
    
    Resource Metadata:
    - ID: ${resource.id}
    - Type: ${resource.type}
    - Region: ${resource.region}
    - Monthly Cost: $${resource.monthlyCost}
    - Tags: ${resource.tags.join(', ')}
    ${isProduction ? "NOTE: This is a PRODUCTION resource. Suggest safe, non-destructive actions only (e.g., right-sizing, creating snapshots) rather than termination." : ""}

    Generate the fix as an AWS CLI command or Terraform snippet.
  `;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Hardened: Clean up any markdown formatting just in case the LLM ignores instructions
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const aiResponse = JSON.parse(responseText);
    
    return {
      fixCode: aiResponse.fixCode,
      explanation: aiResponse.explanation,
      riskLevel: isProduction ? "High" : aiResponse.riskLevel,
      estimatedSavings: aiResponse.estimatedSavings
    };
  } catch (error) {
    console.error("AI Generation Error:", error);
    return {
      fixCode: null,
      explanation: "Error generating AI fix. Manual review required.",
      riskLevel: "Error",
      estimatedSavings: 0
    };
  }
}