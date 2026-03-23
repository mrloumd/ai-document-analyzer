import { generatePresentation } from "@/lib/ppt-generator";
import type { PPTConfig } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text: string = body?.text ?? "";
    const config: PPTConfig | undefined = body?.config;

    if (!text.trim()) {
      return Response.json(
        { error: "No document text provided." },
        { status: 400 },
      );
    }

    if (!config) {
      return Response.json(
        { error: "No presentation configuration provided." },
        { status: 400 },
      );
    }

    const { numSlides, tone } = config;

    if (!Number.isInteger(numSlides) || numSlides < 3 || numSlides > 20) {
      return Response.json(
        { error: "numSlides must be an integer between 3 and 20." },
        { status: 400 },
      );
    }

    if (!["formal", "simple", "academic"].includes(tone)) {
      return Response.json(
        { error: "tone must be one of: formal, simple, academic." },
        { status: 400 },
      );
    }

    const presentation = await generatePresentation(text, config);
    return Response.json(presentation);
  } catch (err) {
    console.error("[generate-presentation] Error:", err);
    return Response.json(
      { error: "Failed to generate presentation. Please try again." },
      { status: 500 },
    );
  }
}
