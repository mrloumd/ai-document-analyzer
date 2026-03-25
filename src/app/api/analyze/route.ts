import { analyzeDocument } from "@/lib/ai";
import { withAuth } from "@/lib/with-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export const POST = withAuth(async (req) => {
  const body = await req.json();
  const text: string = body?.text ?? "";

  if (!text.trim()) {
    return Response.json({ error: "No text provided." }, { status: 400 });
  }

  const result = await analyzeDocument(text);
  return Response.json(result);
});
