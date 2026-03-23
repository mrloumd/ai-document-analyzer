export async function parsePdf(
  buffer: Buffer,
): Promise<{ text: string; pageCount: number }> {
  // Dynamic import avoids pdf-parse running its self-test at module evaluation time
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return {
    text: data.text ?? "",
    pageCount: data.numpages ?? 0,
  };
}
