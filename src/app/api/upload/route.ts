import { v4 as uuidv4 } from "uuid";
import { uploadToS3 } from "@/lib/s3";
import { parsePdf } from "@/lib/parsers/pdf";
import { parseDocx } from "@/lib/parsers/docx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ACCEPTED_TYPES: Record<string, "pdf" | "docx"> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "No file provided." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "File exceeds the 10 MB limit." },
        { status: 413 }
      );
    }

    // Determine type by MIME or extension fallback
    const ext = file.name.split(".").pop()?.toLowerCase();
    const mimeType = file.type || "";
    let fileType: "pdf" | "docx" | null =
      ACCEPTED_TYPES[mimeType] ?? null;

    if (!fileType) {
      if (ext === "pdf") fileType = "pdf";
      else if (ext === "docx") fileType = "docx";
    }

    if (!fileType) {
      return Response.json(
        { error: "Unsupported file type. Please upload a PDF or DOCX file." },
        { status: 422 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse text from document
    let extractedText: string;
    let pageCount: number | undefined;

    if (fileType === "pdf") {
      const parsed = await parsePdf(buffer);
      extractedText = parsed.text;
      pageCount = parsed.pageCount;
    } else {
      const parsed = await parseDocx(buffer);
      extractedText = parsed.text;
    }

    if (!extractedText.trim()) {
      return Response.json(
        { error: "No readable text found in the document." },
        { status: 422 }
      );
    }

    // Upload to S3
    const s3Key = `uploads/${uuidv4()}/${file.name}`;
    const contentType =
      fileType === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    await uploadToS3(buffer, s3Key, contentType);

    return Response.json({
      s3Key,
      extractedText,
      fileName: file.name,
      fileSize: file.size,
      fileType,
      pageCount,
    });
  } catch (err) {
    console.error("[upload]", err);
    return Response.json(
      { error: "Failed to process the file. Please try again." },
      { status: 500 }
    );
  }
}
