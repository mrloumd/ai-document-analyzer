import OpenAI from "openai";
import type { AnalysisResult } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const INSTRUCTIONS = `You are an expert document analyst. Analyze the provided document text and respond with ONLY a valid JSON object — no markdown, no code fences, no explanation. Use exactly this shape:

{
  "summary": "A comprehensive 2–3 paragraph summary of the document's content, purpose, and main conclusions.",
  "keyPoints": [
    "Specific key point extracted from the document (aim for 5–8 total)"
  ],
  "insights": [
    "A strategic or analytical insight about the document (aim for 3–5 total)"
  ]
}`;

export async function analyzeDocument(text: string): Promise<AnalysisResult> {
  const maxInputChars = 120_000;
  const input =
    text.length > maxInputChars
      ? text.slice(0, maxInputChars) + "\n\n[…document truncated due to length]"
      : text;

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    instructions: INSTRUCTIONS,
    input: `Analyze this document and return the result as JSON:\n\n${input}`,
    text: {
      format: { type: "json_object" },
    },
    store: true,
  });

  const raw = response.output_text?.trim() ?? "";

  try {
    const parsed = JSON.parse(raw) as AnalysisResult;
    if (
      !parsed.summary ||
      !Array.isArray(parsed.keyPoints) ||
      !Array.isArray(parsed.insights)
    ) {
      throw new Error("Unexpected JSON shape");
    }
    return parsed;
  } catch {
    throw new Error("Failed to parse structured response from AI");
  }
}
