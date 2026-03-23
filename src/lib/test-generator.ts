import OpenAI from "openai";
import type { GeneratedTest, TestConfig } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_INPUT_CHARS = 100_000;

function buildInstructions(config: TestConfig): string {
  const parts: string[] = [];
  if (config.multipleChoice > 0)
    parts.push(
      `${config.multipleChoice} Multiple Choice questions (each with exactly 4 options labeled "A. ...", "B. ...", "C. ...", "D. ..."; specify the correct answer as a single letter: A, B, C, or D)`,
    );
  if (config.fillInTheBlanks > 0)
    parts.push(
      `${config.fillInTheBlanks} Fill in the Blanks questions (use exactly ____ as the blank in the sentence)`,
    );
  if (config.enumeration > 0)
    parts.push(
      `${config.enumeration} Enumeration questions (ask students to list specific items from the document)`,
    );
  if (config.essay > 0)
    parts.push(
      `${config.essay} Essay questions (open-ended, thought-provoking, include a short hint)`,
    );

  return `You are an expert educator and test creator. Based on the provided document, create a comprehensive exam. Respond with ONLY valid JSON — no markdown, no code fences, no extra text.

Required counts:
${parts.map((p) => `- ${p}`).join("\n")}

Use EXACTLY this JSON structure:
{
  "title": "Descriptive test title based on the document topic",
  "instructions": "Clear, encouraging general instructions for students (2-3 sentences)",
  "multipleChoice": [
    {
      "type": "multipleChoice",
      "question": "Question text here?",
      "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
      "answer": "A"
    }
  ],
  "fillInTheBlanks": [
    {
      "type": "fillInTheBlanks",
      "question": "The ____ is responsible for...",
      "answer": "correct word or phrase"
    }
  ],
  "enumeration": [
    {
      "type": "enumeration",
      "question": "List the [N] main [items] discussed in the document.",
      "answers": ["First item", "Second item", "Third item"]
    }
  ],
  "essay": [
    {
      "type": "essay",
      "question": "Discuss the significance of... in relation to...",
      "hint": "Consider discussing the following aspects: ..."
    }
  ]
}

Rules:
- Generate questions that test genuine understanding of the document content.
- All questions must be directly answerable from the document.
- For sections with 0 count, use an empty array [].
- Do NOT include any text outside the JSON object.`;
}

export async function generateTest(
  text: string,
  config: TestConfig,
): Promise<GeneratedTest> {
  const input =
    text.length > MAX_INPUT_CHARS
      ? text.slice(0, MAX_INPUT_CHARS) +
        "\n\n[...document truncated due to length]"
      : text;

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    instructions: buildInstructions(config),
    input: `Generate the test as JSON from this document:\n\n${input}`,
    text: { format: { type: "json_object" } },
    store: true,
  });

  const raw = response.output_text?.trim() ?? "";

  let parsed: Partial<GeneratedTest>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Failed to parse structured test from AI response.");
  }

  if (
    !parsed.title ||
    !parsed.instructions ||
    !Array.isArray(parsed.multipleChoice) ||
    !Array.isArray(parsed.fillInTheBlanks) ||
    !Array.isArray(parsed.enumeration) ||
    !Array.isArray(parsed.essay)
  ) {
    throw new Error("AI returned an unexpected response format.");
  }

  return {
    title: parsed.title,
    instructions: parsed.instructions,
    multipleChoice: parsed.multipleChoice,
    fillInTheBlanks: parsed.fillInTheBlanks,
    enumeration: parsed.enumeration,
    essay: parsed.essay,
    generatedAt: new Date().toISOString(),
  };
}
