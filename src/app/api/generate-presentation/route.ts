import { generatePresentation } from "@/lib/ppt-generator";
import { withAuth } from "@/lib/with-auth";
import type { PPTConfig } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export const POST = withAuth(async (req, _userId, plan) => {
  const body = await req.json();
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

  const { numSlides, tone, template } = config;

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
  if (!["default", "light", "dark"].includes(template ?? "default")) {
    return Response.json({ error: "Invalid template." }, { status: 400 });
  }
  if (plan === "free" && numSlides > 5) {
    return Response.json(
      {
        error: "Free accounts are limited to 5 slides. Top up to generate more.",
        code: "UPGRADE_REQUIRED",
      },
      { status: 403 },
    );
  }
  if (plan === "free" && template && template !== "default") {
    return Response.json(
      {
        error: "Templates are a paid feature. Top up to unlock.",
        code: "UPGRADE_REQUIRED",
      },
      { status: 403 },
    );
  }

  const presentation = await generatePresentation(text, config);
  return Response.json({ ...presentation, template: template ?? "default" });
});
