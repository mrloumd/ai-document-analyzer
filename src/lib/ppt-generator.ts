import OpenAI from "openai";
import type { GeneratedPresentation, GeneratedSlide, PPTConfig } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_INPUT_CHARS = 100_000;

const TONE_DESCRIPTIONS: Record<PPTConfig["tone"], string> = {
  formal:
    "professional and formal, suitable for corporate or business presentations — structured, authoritative language",
  simple:
    "clear and simple, accessible to general audiences — short sentences, plain vocabulary, avoid jargon",
  academic:
    "scholarly and precise, with domain-specific terminology appropriate for academic or research presentations",
};

function buildPPTInstructions(config: PPTConfig): string {
  return `You are an expert presentation designer. Based on the provided document, create a structured PowerPoint presentation outline. This response must be in JSON format — respond with ONLY valid JSON, no markdown, no code fences, no extra text.

Presentation requirements:
- Exactly ${config.numSlides} content slides
- Tone: ${TONE_DESCRIPTIONS[config.tone]}
- Each slide must have a concise title (max 8 words) and 3 to 5 bullet points
- Bullet points must be concise (max 15 words each), factual, and directly from the document
- Cover the full document content spread evenly across slides

Use EXACTLY this JSON structure:
{
  "title": "Compelling presentation title based on the document topic",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide title here",
      "bullets": [
        "First key point from the document",
        "Second key point from the document",
        "Third key point from the document"
      ]
    }
  ]
}

Rules:
- Generate exactly ${config.numSlides} slide objects in the "slides" array.
- slideNumber must start at 1 and increment sequentially.
- All content must be derived directly from the document.
- For the JSON output, include only the object above with no wrapper or extra fields.
- Do NOT include any text outside the JSON object.`;
}

export async function generatePresentation(
  text: string,
  config: PPTConfig,
): Promise<GeneratedPresentation> {
  const input =
    text.length > MAX_INPUT_CHARS
      ? text.slice(0, MAX_INPUT_CHARS) +
        "\n\n[...document truncated due to length]"
      : text;

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    instructions: buildPPTInstructions(config),
    input: `Generate the presentation outline as JSON from this document:\n\n${input}`,
    text: { format: { type: "json_object" } },
    store: true,
  });

  const raw = response.output_text?.trim() ?? "";

  let parsed: Partial<GeneratedPresentation>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      "Failed to parse structured presentation from AI response.",
    );
  }

  if (
    !parsed.title ||
    !Array.isArray(parsed.slides) ||
    parsed.slides.length === 0
  ) {
    throw new Error("AI returned an unexpected response format.");
  }

  for (const slide of parsed.slides as GeneratedSlide[]) {
    if (
      typeof slide.slideNumber !== "number" ||
      typeof slide.title !== "string" ||
      !Array.isArray(slide.bullets)
    ) {
      throw new Error("AI returned malformed slide data.");
    }
  }

  return {
    title: parsed.title,
    slides: parsed.slides as GeneratedSlide[],
    generatedAt: new Date().toISOString(),
  };
}
