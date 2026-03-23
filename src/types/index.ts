export interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  insights: string[];
}

export interface UploadResponse {
  s3Key: string;
  extractedText: string;
  fileName: string;
  fileSize: number;
  fileType: "pdf" | "docx";
  pageCount?: number;
}

export type UploadStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "done"
  | "error";

export interface AppState {
  status: UploadStatus;
  uploadProgress: number;
  fileName: string | null;
  fileSize: number | null;
  result: AnalysisResult | null;
  error: string | null;
}
