import { generateTest } from "@/lib/test-generator";
import type { TestConfig } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text: string = body?.text ?? "";
    const config: TestConfig | undefined = body?.config;

    if (!text.trim()) {
      return Response.json({ error: "No document text provided." }, { status: 400 });
    }

    if (!config) {
      return Response.json({ error: "No test configuration provided." }, { status: 400 });
    }

    const { total, multipleChoice, fillInTheBlanks, enumeration, essay } = config;

    if (!Number.isInteger(total) || total < 1) {
      return Response.json({ error: "Total must be at least 1." }, { status: 400 });
    }

    for (const [key, val] of Object.entries({ multipleChoice, fillInTheBlanks, enumeration, essay })) {
      if (!Number.isInteger(val) || val < 0) {
        return Response.json(
          { error: `${key} must be a non-negative integer.` },
          { status: 400 }
        );
      }
    }

    const sum = multipleChoice + fillInTheBlanks + enumeration + essay;
    if (sum !== total) {
      return Response.json(
        { error: `Question counts (${sum}) do not match the total (${total}).` },
        { status: 400 }
      );
    }

    const test = await generateTest(text, config);
    return Response.json(test);
  } catch (err) {
    console.error("[generate-test]", err);
    return Response.json(
      { error: "Failed to generate test. Please try again." },
      { status: 500 }
    );
  }
}
