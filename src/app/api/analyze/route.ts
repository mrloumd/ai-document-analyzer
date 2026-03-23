import { analyzeDocument } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text: string = body?.text ?? "";

    if (!text.trim()) {
      return Response.json({ error: "No text provided." }, { status: 400 });
    }

    const result = await analyzeDocument(text);
    return Response.json(result);
  } catch (err) {
    console.error("[analyze]", err);
    return Response.json(
      { error: "Failed to analyze the document. Please try again." },
      { status: 500 },
    );
  }
}
