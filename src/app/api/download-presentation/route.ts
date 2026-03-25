import { buildPptx } from "@/lib/pptx-builder";
import type { GeneratedPresentation } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const presentation: GeneratedPresentation | undefined = body?.presentation;
    const rawName: string =
      body?.fileName ?? presentation?.title ?? "presentation";

    if (
      !presentation ||
      typeof presentation.title !== "string" ||
      !Array.isArray(presentation.slides)
    ) {
      return Response.json(
        { error: "No valid presentation data provided." },
        { status: 400 },
      );
    }

    const safeName =
      rawName
        .replace(/[^a-zA-Z0-9_\- ]/g, "")
        .trim()
        .replace(/\s+/g, "_") || "presentation";

    const buffer = await buildPptx(presentation, presentation.template ?? "default");

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${safeName}.pptx"`,
      },
    });
  } catch (err) {
    console.error("[download-presentation] Error:", err);
    return Response.json(
      { error: "Failed to generate PPTX file. Please try again." },
      { status: 500 },
    );
  }
}
