import OpenAI from "openai";
import type { GeneratedPresentation, GeneratedSlide, PPTConfig } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_INPUT_CHARS = 100_000;

const TONE_INSTRUCTIONS: Record<PPTConfig["tone"], string> = {
  formal: `Tone: Professional and formal — suitable for corporate or business presentations.
- Write each bullet as a complete, informative sentence (20–35 words).
- Use structured, authoritative language.
- Explain the significance or implication of each point, not just the fact.`,
  simple: `Tone: Clear and simple — accessible to a general audience.
- Write each bullet as a plain, easy-to-understand sentence (15–30 words).
- Avoid jargon; if a technical term is needed, briefly explain it in the same bullet.
- Each bullet should answer "what does this mean for the reader?" in everyday language.`,
  academic: `Tone: Scholarly and precise — suitable for academic or research presentations.
- Write each bullet as a detailed, evidence-based sentence (25–40 words).
- Use domain-specific terminology where appropriate.
- Reference the mechanism, finding, or theoretical basis behind each point, not just the conclusion.`,
};

function buildPPTInstructions(config: PPTConfig): string {
  return `You are an expert presentation designer. Based on the provided document, create a detailed PowerPoint presentation outline. This response must be in JSON format — respond with ONLY valid JSON, no markdown, no code fences, no extra text.

${TONE_INSTRUCTIONS[config.tone]}

Presentation requirements:
- Exactly ${config.numSlides} content slides
- Each slide must have a clear, descriptive title (max 10 words)
- Each slide must have 4 to 6 bullet points
- Each bullet must be a full, explanatory sentence — not a fragment or keyword phrase
- Bullets must explain WHY or HOW, not just state WHAT
- Cover the full document content spread evenly across all slides

Use EXACTLY this JSON structure:
{
  "title": "Compelling presentation title based on the document topic",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide title here",
      "bullets": [
        "Detailed explanatory sentence about the first key concept from the document.",
        "Detailed explanatory sentence about the second key concept from the document.",
        "Detailed explanatory sentence about the third key concept from the document.",
        "Detailed explanatory sentence about the fourth key concept from the document."
      ]
    }
  ]
}

Rules:
- Generate exactly ${config.numSlides} slide objects in the "slides" array.
- slideNumber must start at 1 and increment sequentially.
- All content must be derived directly from the document.
- Never use vague filler phrases like "covers important topics" or "addresses key areas".
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
