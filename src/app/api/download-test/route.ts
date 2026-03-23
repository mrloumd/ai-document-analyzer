import { generateDocx, generatePdf } from "@/lib/download-generators";
import type { GeneratedTest } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const test: GeneratedTest | undefined = body?.test;
    const format: "pdf" | "docx" = body?.format ?? "pdf";
    const rawName: string = body?.fileName ?? test?.title ?? "test";

    if (!test || !test.title) {
      return Response.json({ error: "No test data provided." }, { status: 400 });
    }

    // Sanitize filename
    const safeName = rawName.replace(/[^a-zA-Z0-9_\- ]/g, "").trim().replace(/\s+/g, "_") || "test";

    if (format === "docx") {
      const buffer = await generateDocx(test);
      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${safeName}.docx"`,
        },
      });
    }

    // Default: PDF
    const buffer = await generatePdf(test);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
      },
    });
  } catch (err) {
    console.error("[download-test]", err);
    return Response.json(
      { error: "Failed to generate file. Please try again." },
      { status: 500 }
    );
  }
}
