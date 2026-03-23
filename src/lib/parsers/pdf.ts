import { PDFParse } from "pdf-parse";

export async function parsePdf(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const info = await parser.getInfo();
    await parser.destroy();
    return {
      text: result.text ?? "",
      pageCount: info.total ?? 0,
    };
  } catch (err) {
    await parser.destroy();
    throw err;
  }
}
