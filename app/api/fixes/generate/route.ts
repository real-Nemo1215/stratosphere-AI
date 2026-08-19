import { NextResponse } from "next/server";
import { generateAIFix } from "../../../../lib/ai-fix-engine";

export async function POST(req: Request) {
  try {
    const { finding, resource } = await req.json();

    if (!finding || !resource) {
      return NextResponse.json({ error: "Missing finding or resource data" }, { status: 400 });
    }

    const aiFix = await generateAIFix(finding, resource);
    
    return NextResponse.json({ success: true, fix: aiFix }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
