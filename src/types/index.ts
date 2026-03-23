// -- Existing types --

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

/** Status passed to FileUpload component */
export type UploadStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "done"
  | "error";

// -- Test Generator types --

export interface TestConfig {
  total: number;
  multipleChoice: number;
  fillInTheBlanks: number;
  enumeration: number;
  essay: number;
}

export interface MultipleChoiceQuestion {
  type: "multipleChoice";
  question: string;
  /** 4 options, each prefixed e.g. "A. ..." */
  options: string[];
  /** Correct answer letter: "A" | "B" | "C" | "D" */
  answer: string;
}

export interface FillInTheBlanksQuestion {
  type: "fillInTheBlanks";
  /** Contains ____ as the blank placeholder */
  question: string;
  answer: string;
}

export interface EnumerationQuestion {
  type: "enumeration";
  question: string;
  answers: string[];
}

export interface EssayQuestion {
  type: "essay";
  question: string;
  hint?: string;
}

export type TestQuestion =
  | MultipleChoiceQuestion
  | FillInTheBlanksQuestion
  | EnumerationQuestion
  | EssayQuestion;

export interface GeneratedTest {
  title: string;
  instructions: string;
  multipleChoice: MultipleChoiceQuestion[];
  fillInTheBlanks: FillInTheBlanksQuestion[];
  enumeration: EnumerationQuestion[];
  essay: EssayQuestion[];
  generatedAt: string;
}

// -- App state --

export type AppMode = "summary" | "test" | "presentation";

export type AppStatus =
  | "idle"
  | "uploading"
  | "extracted"   // text extracted, waiting for test config (test mode only)
  | "analyzing"   // summary AI call in progress
  | "generating"  // test AI call in progress
  | "done"
  | "error";

export interface AppState {
  status: AppStatus;
  mode: AppMode;
  uploadProgress: number;
  fileName: string | null;
  fileSize: number | null;
  extractedText: string | null;
  result: AnalysisResult | null;
  testResult: GeneratedTest | null;
  presentationResult: GeneratedPresentation | null;
  error: string | null;
}

// -- Presentation Generator types --

export interface PPTConfig {
  numSlides: number;
  tone: "formal" | "simple" | "academic";
}

export interface GeneratedSlide {
  slideNumber: number;
  title: string;
  bullets: string[];
}

export interface GeneratedPresentation {
  title: string;
  slides: GeneratedSlide[];
  generatedAt: string;
}
