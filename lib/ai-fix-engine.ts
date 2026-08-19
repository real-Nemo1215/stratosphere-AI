import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const buildPrompt = (finding: any, resource: any) => {
  return `
You are an expert Cloud FinOps Architect. A waste detection engine found an issue in a cloud environment. 
Generate a fix for the following finding and resource.

Resource Type: ${resource.resource_type} (e.g., EC2, RDS, EBS, ELB, S3)
Resource ID: ${resource.resource_id}
Region: ${resource.region}
Resource Metadata: ${JSON.stringify(resource.config)}
Finding Type: ${finding.type} (e.g., idle_instance, oversized_instance, unattached_volume)
Estimated Monthly Waste: $${finding.estimated_monthly_waste}

Based on this, provide a response in STRICT JSON format with the following keys:
- "explanation": A plain-English explanation of why this is waste and how to fix it.
- "fix_snippet": The exact CLI command or Terraform snippet to execute the fix.
- "risk_level": "Low", "Medium", or "High".
- "estimated_savings": The estimated monthly savings (use the figure provided).

Return ONLY valid JSON. Do not include markdown backticks.
`;
};

export async function generateAIFix(finding: any, resource: any) {
  try {
    const prompt = buildPrompt(finding, resource);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const aiFix = JSON.parse(text);
    return aiFix;
  } catch (error) {
    console.error("Error generating AI fix:", error);
    return {
      explanation: "Failed to generate AI explanation.",
      fix_snippet: "",
      risk_level: "Unknown",
      estimated_savings: finding.estimated_monthly_waste
    };
  }
}
