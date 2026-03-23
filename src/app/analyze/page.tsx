"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import ResultDisplay from "@/components/ResultDisplay";
import type { AnalysisResult, AppState } from "@/types";

const INITIAL_STATE: AppState = {
  status: "idle",
  uploadProgress: 0,
  fileName: null,
  fileSize: null,
  result: null,
  error: null,
};

function uploadFile(
  file: File,
  onProgress: (pct: number) => void
): Promise<{ extractedText: string; fileName: string; fileSize: number }> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.error) {
            reject(new Error(data.error));
          } else {
            resolve({
              extractedText: data.extractedText,
              fileName: data.fileName,
              fileSize: data.fileSize,
            });
          }
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

    xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));
    xhr.addEventListener("abort", () => reject(new Error("Upload was cancelled.")));

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
  if (!res.ok || data.error) {
    throw new Error(data.error ?? "Analysis failed.");
  }
  return data as AnalysisResult;
}

export default function AnalyzePage() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const update = (patch: Partial<AppState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const handleFileAccepted = useCallback(async (file: File) => {
    update({
      status: "uploading",
      uploadProgress: 0,
      fileName: file.name,
      fileSize: file.size,
      error: null,
      result: null,
    });

    try {
      const { extractedText, fileName } = await uploadFile(file, (pct) =>
        update({ uploadProgress: pct })
      );

      update({ status: "analyzing", uploadProgress: 100 });
      const result = await analyzeText(extractedText);

      update({ status: "done", result, fileName });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      update({ status: "error", error: message });
    }
  }, []);

  const handleReset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Document Analyzer
            </h1>
            <p className="text-slate-400 text-sm">
              Upload your PDF or DOCX and get instant AI-powered analysis.
            </p>
          </div>
        </section>

        {/* -- Upload + Results -- */}
        <section className="mx-auto max-w-3xl px-6 py-10 space-y-8">
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
                <h2 className="text-white font-semibold text-base">Upload Document</h2>
                <p className="text-slate-500 text-xs mt-0.5">PDF or DOCX · Max 10 MB</p>
              </div>
            </div>

            <FileUpload
              status={state.status}
              uploadProgress={state.uploadProgress}
              onFileAccepted={handleFileAccepted}
              onReset={handleReset}
              fileName={state.fileName}
              fileSize={state.fileSize}
              error={state.error}
            />
          </div>

          {/* Results */}
          {state.status === "done" && state.result && state.fileName && (
            <ResultDisplay result={state.result} fileName={state.fileName} />
          )}
        </section>
      </main>

      {/* -- Footer -- */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            DocuMind AI
          </span>
          <span>Built with Next.js, TypeScript &amp; OpenAI</span>
        </div>
      </footer>
    </>
  );
}
