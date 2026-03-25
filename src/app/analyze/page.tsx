"use client";

import { useCallback, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import ResultDisplay from "@/components/summary/ResultDisplay";
import TestConfigForm from "@/components/test/TestConfigForm";
import TestResultDisplay from "@/components/test/TestResultDisplay";
import PPTConfigForm from "@/components/presentation/PPTConfigForm";
import PPTPreview from "@/components/presentation/PPTPreview";
import type {
  AnalysisResult,
  AppMode,
  AppState,
  AppStatus,
  GeneratedPresentation,
  GeneratedTest,
  PPTConfig,
  TestConfig,
  UploadStatus,
} from "@/types";

// -- Custom error with API code --

class ApiError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

// -- State --

const INITIAL_STATE: AppState = {
  status: "idle",
  mode: "summary",
  uploadProgress: 0,
  fileName: null,
  fileSize: null,
  extractedText: null,
  result: null,
  testResult: null,
  presentationResult: null,
  error: null,
};

// -- Helpers --

/** Map the richer AppStatus to what FileUpload expects */
function toUploadStatus(s: AppStatus): UploadStatus {
  if (s === "uploading") return "uploading";
  if (s === "analyzing") return "analyzing";
  if (s === "extracted" || s === "generating" || s === "done") return "done";
  if (s === "error") return "error";
  return "idle";
}

function uploadFile(
  file: File,
  onProgress: (pct: number) => void,
): Promise<{ extractedText: string; fileName: string; fileSize: number }> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable)
        onProgress(Math.round((e.loaded / e.total) * 100));
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.error) reject(new Error(data.error));
          else
            resolve({
              extractedText: data.extractedText,
              fileName: data.fileName,
              fileSize: data.fileSize,
            });
        } catch {
          reject(new Error("Invalid response from server."));
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          reject(new Error(data.error ?? "Upload failed."));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}.`));
        }
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during upload.")),
    );
    xhr.addEventListener("abort", () =>
      reject(new Error("Upload was cancelled.")),
    );

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}

async function analyzeText(text: string): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new ApiError(data.error ?? "Analysis failed.", data.code);
  return data as AnalysisResult;
}

async function generateTestFromText(
  text: string,
  config: TestConfig,
): Promise<GeneratedTest> {
  const res = await fetch("/api/generate-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, config }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new ApiError(data.error ?? "Test generation failed.", data.code);
  return data as GeneratedTest;
}

async function generatePresentationFromText(
  text: string,
  config: PPTConfig,
): Promise<GeneratedPresentation> {
  const res = await fetch("/api/generate-presentation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, config }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new ApiError(data.error ?? "Presentation generation failed.", data.code);
  return data as GeneratedPresentation;
}

// -- Mode toggle component --

function ModeToggle({
  mode,
  onChange,
  disabled,
}: {
  mode: AppMode;
  onChange: (m: AppMode) => void;
  disabled: boolean;
}) {
  const MODES: { value: AppMode; label: string; icon: React.ReactNode }[] = [
    {
      value: "summary",
      label: "Summary",
      icon: (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      value: "test",
      label: "Generate Test",
      icon: (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      value: "presentation",
      label: "Presentation",
      icon: (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="inline-flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/8 gap-1">
      {MODES.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => !disabled && onChange(value)}
          disabled={disabled}
          className={[
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
            mode === value
              ? "bg-brand text-white shadow-sm shadow-brand/30"
              : "text-slate-400 hover:text-slate-200 disabled:cursor-not-allowed",
          ].join(" ")}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

// -- Page --

export default function AnalyzePage() {
  const { data: session, status: authStatus, update: updateSession } = useSession();
  const router = useRouter();
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  const update = useCallback(
    (patch: Partial<AppState>) => setState((prev) => ({ ...prev, ...patch })),
    [],
  );

  const modeRef = useRef<AppMode>("summary");
  modeRef.current = state.mode;

  const tokens = session?.user?.tokens ?? 0;
  const isAuthenticated = authStatus === "authenticated";

  // -- Mode change --
  const handleModeChange = useCallback((newMode: AppMode) => {
    setState((prev) => {
      if (prev.mode === newMode) return prev;
      const isBusy =
        prev.status === "uploading" ||
        prev.status === "analyzing" ||
        prev.status === "generating";
      if (isBusy) return prev;
      return {
        ...prev,
        mode: newMode,
        status: prev.extractedText ? "extracted" : "idle",
        result: null,
        testResult: null,
        presentationResult: null,
        error: null,
      };
    });
  }, []);

  // -- File accepted --
  const handleFileAccepted = useCallback(
    async (file: File) => {
      // Redirect to sign-in if not authenticated
      if (!isAuthenticated) {
        router.push("/auth/signin");
        return;
      }

      setState((prev) => ({
        ...prev,
        status: "uploading",
        uploadProgress: 0,
        fileName: file.name,
        fileSize: file.size,
        extractedText: null,
        result: null,
        testResult: null,
        presentationResult: null,
        error: null,
      }));
      setUpgradeRequired(false);

      try {
        const { extractedText, fileName } = await uploadFile(file, (pct) =>
          update({ uploadProgress: pct }),
        );

        if (modeRef.current === "summary") {
          update({ status: "analyzing", uploadProgress: 100, extractedText, fileName });
          try {
            const result = await analyzeText(extractedText);
            update({ status: "done", result });
            await updateSession();
          } catch (err) {
            if (err instanceof ApiError && err.code === "NO_TOKENS") {
              setUpgradeRequired(true);
              update({ status: "idle" });
            } else {
              update({ status: "error", error: err instanceof Error ? err.message : "Analysis failed." });
            }
          }
        } else {
          update({ status: "extracted", uploadProgress: 100, extractedText, fileName });
        }
      } catch (err) {
        update({ status: "error", error: err instanceof Error ? err.message : "Something went wrong." });
      }
    },
    [isAuthenticated, router, update, updateSession],
  );

  // -- Reset (keep mode) --
  const handleReset = useCallback(() => {
    setState((prev) => ({ ...INITIAL_STATE, mode: prev.mode }));
    setUpgradeRequired(false);
  }, []);

  // -- Generate test --
  const handleGenerateTest = useCallback(
    async (config: TestConfig) => {
      const text = state.extractedText;
      if (!text) return;

      update({ status: "generating", error: null, testResult: null });

      try {
        const testResult = await generateTestFromText(text, config);
        update({ status: "done", testResult });
        await updateSession();
      } catch (err) {
        if (err instanceof ApiError && err.code === "NO_TOKENS") {
          setUpgradeRequired(true);
          update({ status: "extracted", error: null });
        } else {
          update({ status: "extracted", error: err instanceof Error ? err.message : "Test generation failed." });
        }
      }
    },
    [state.extractedText, update, updateSession],
  );

  // -- Generate presentation --
  const handleGeneratePresentation = useCallback(
    async (config: PPTConfig) => {
      const text = state.extractedText;
      if (!text) return;

      update({ status: "generating", error: null, presentationResult: null });

      try {
        const presentationResult = await generatePresentationFromText(text, config);
        update({ status: "done", presentationResult });
        await updateSession();
      } catch (err) {
        if (err instanceof ApiError && err.code === "NO_TOKENS") {
          setUpgradeRequired(true);
          update({ status: "extracted", error: null });
        } else {
          update({ status: "extracted", error: err instanceof Error ? err.message : "Presentation generation failed." });
        }
      }
    },
    [state.extractedText, update, updateSession],
  );

  // -- Derived --
  const {
    status,
    mode,
    result,
    testResult,
    presentationResult,
    fileName,
    fileSize,
    error,
  } = state;
  const uploadStatus = toUploadStatus(status);
  const isBusy =
    status === "uploading" || status === "analyzing" || status === "generating";
  const hasText = !!state.extractedText;

  return (
    <>
      <Header />

      <main className="flex-1 pt-16">
        {/* -- Page header -- */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[250px] rounded-full bg-brand/8 blur-[80px]" />
          </div>
          <div className="relative mx-auto max-w-3xl px-6 pt-10 pb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-5 group"
              suppressHydrationWarning
            >
              <svg
                className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to home
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  Document Analyzer
                </h1>
                <p className="text-slate-400 text-sm">
                  {mode === "summary"
                    ? "Upload your PDF or DOCX and get instant AI-powered analysis."
                    : mode === "test"
                      ? "Upload your document and generate a ready-to-use exam."
                      : "Upload your document and generate a PowerPoint presentation."}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {isAuthenticated && (
                  <span className={`text-xs font-medium ${tokens > 0 ? "text-slate-400" : "text-rose-400"}`}>
                    {tokens} token{tokens !== 1 ? "s" : ""} remaining
                  </span>
                )}
                <ModeToggle mode={mode} onChange={handleModeChange} disabled={isBusy} />
              </div>
            </div>
          </div>
        </section>

        {/* -- Content -- */}
        <section className="mx-auto max-w-3xl px-6 py-10 space-y-6">

          {/* No tokens banner */}
          {isAuthenticated && (tokens === 0 || upgradeRequired) && (
            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/8 px-5 py-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <p className="text-amber-400 font-semibold text-sm">No tokens remaining</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  You&apos;ve used your free token. Contact us to get more tokens and keep analyzing documents.
                </p>
              </div>
            </div>
          )}

          {/* Upload card */}
          <div className="rounded-3xl border border-white/8 bg-white/[0.015] p-6 md:p-8 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-brand/15 border border-brand/20 flex items-center justify-center">
                <svg
                  className="w-4.5 h-4.5 text-brand"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-semibold text-base">
                  Upload Document
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  PDF or DOCX &middot; Max 10 MB
                </p>
              </div>
            </div>

            <FileUpload
              status={uploadStatus}
              uploadProgress={state.uploadProgress}
              onFileAccepted={handleFileAccepted}
              onReset={handleReset}
              fileName={fileName}
              fileSize={fileSize}
              error={uploadStatus === "error" ? error : null}
            />
          </div>

          {/* Test config form (test mode, after file extracted) */}
          {mode === "test" && (
            <TestConfigForm
              isEnabled={hasText}
              isGenerating={status === "generating"}
              error={status === "extracted" ? error : null}
              onGenerate={handleGenerateTest}
            />
          )}

          {/* PPT config form (presentation mode) */}
          {mode === "presentation" && (
            <PPTConfigForm
              isEnabled={hasText}
              isGenerating={status === "generating"}
              error={status === "extracted" ? error : null}
              onGenerate={handleGeneratePresentation}
            />
          )}

          {/* Generating loading card */}
          {status === "generating" && (
            <div className="rounded-2xl border border-brand/20 bg-brand/5 p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-brand/15 border border-brand/25 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-brand animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-base">
                  {mode === "presentation"
                    ? "Generating your presentation…"
                    : "Generating your test…"}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  {mode === "presentation"
                    ? "Creating your slide outline from your document. This may take up to 30 seconds."
                    : "Crafting questions from your document. This may take up to 30 seconds."}
                </p>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-dark to-brand-light rounded-full animate-[progress-indeterminate_1.5s_ease-in-out_infinite]" />
              </div>
            </div>
          )}

          {/* Summary result */}
          {status === "done" && mode === "summary" && result && fileName && (
            <ResultDisplay result={result} fileName={fileName} />
          )}

          {/* Test result */}
          {status === "done" && mode === "test" && testResult && fileName && (
            <TestResultDisplay test={testResult} fileName={fileName} />
          )}

          {/* Presentation result */}
          {status === "done" &&
            mode === "presentation" &&
            presentationResult &&
            fileName && (
              <PPTPreview
                presentation={presentationResult}
                fileName={fileName}
              />
            )}
        </section>
      </main>

      {/* -- Footer -- */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            StudyMind
          </span>
          <span>Built with Next.js &amp; TypeScript</span>
        </div>
      </footer>
    </>
  );
}
