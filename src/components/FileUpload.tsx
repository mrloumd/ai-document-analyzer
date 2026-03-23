"use client";

import React, { useCallback, useRef, useState } from "react";
import type { UploadStatus } from "@/types";

interface FileUploadProps {
  status: UploadStatus;
  uploadProgress: number;
  onFileAccepted: (file: File) => void;
  onReset: () => void;
  fileName: string | null;
  fileSize: number | null;
  error: string | null;
}

const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return "Only PDF and DOCX files are supported.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File is too large. Maximum size is 10 MB.`;
  }
  return null;
}

export default function FileUpload({
  status,
  uploadProgress,
  onFileAccepted,
  onReset,
  fileName,
  fileSize,
  error,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error || localError;
  const isActive = status === "uploading" || status === "analyzing";
  const isDone = status === "done";

  const handleFile = useCallback(
    (file: File) => {
      setLocalError(null);
      const err = validateFile(file);
      if (err) {
        setLocalError(err);
        return;
      }
      onFileAccepted(file);
    },
    [onFileAccepted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (isActive) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, isActive]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // reset input so same file can be re-selected after reset
      e.target.value = "";
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    if (!isActive) inputRef.current?.click();
  }, [isActive]);

  // -- Idle / error state --
  if (status === "idle" || status === "error") {
    return (
      <div className="w-full">
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          className={[
            "relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer",
            "flex flex-col items-center justify-center text-center gap-5 py-16 px-8",
            isDragging
              ? "border-brand bg-brand/10 scale-[1.01]"
              : "border-white/10 bg-white/[0.02] hover:border-brand/50 hover:bg-white/[0.04]",
          ].join(" ")}
        >
          {/* Icon */}
          <div
            className={[
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
              isDragging
                ? "bg-brand/20"
                : "bg-white/5",
            ].join(" ")}
          >
            <svg
              className={`w-8 h-8 ${isDragging ? "text-brand" : "text-slate-400"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          <div>
            <p className="text-white font-semibold text-lg mb-1">
              {isDragging ? "Drop it here" : "Drop your file here"}
            </p>
            <p className="text-slate-400 text-sm">
              or{" "}
              <span className="text-brand underline underline-offset-2">
                click to browse
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              PDF
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-light"></span>
              DOCX
            </span>
            <span className="text-slate-600">·</span>
            <span>Max 10 MB</span>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>

        {/* Error message */}
        {displayError && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <svg
              className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-300">{displayError}</p>
              {status === "error" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocalError(null);
                    onReset();
                  }}
                  className="mt-1 text-xs text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -- Uploading / Analyzing state --
  if (status === "uploading" || status === "analyzing") {
    const isUploading = status === "uploading";
    return (
      <div className="w-full rounded-2xl border border-white/10 bg-white/[0.02] p-8">
        <div className="flex items-center gap-4 mb-6">
          {/* File icon */}
          <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6 text-brand"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium truncate">{fileName}</p>
            <p className="text-slate-400 text-sm">
              {fileSize ? formatBytes(fileSize) : ""}
            </p>
          </div>
        </div>

        {/* Status label */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
            {isUploading ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
                Uploading &amp; extracting text…
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 text-brand-light animate-spin"
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
                Analyzing with AI…
              </>
            )}
          </span>
          {isUploading && (
            <span className="text-sm text-brand font-mono">
              {uploadProgress}%
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          {isUploading ? (
            <div
              className="h-full bg-gradient-to-r from-brand-dark to-brand-light rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          ) : (
            <div className="h-full bg-gradient-to-r from-brand-dark to-brand-light rounded-full animate-[progress-indeterminate_1.5s_ease-in-out_infinite]" />
          )}
        </div>

        {status === "analyzing" && (
          <p className="mt-4 text-xs text-slate-500 text-center">
            OpenAI is reading your document and extracting insights…
          </p>
        )}
      </div>
    );
  }

  // -- Done state --
  if (isDone) {
    return (
      <div className="w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium truncate">{fileName}</p>
            <p className="text-emerald-400 text-sm">Analysis complete</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="shrink-0 px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-sm transition-colors"
        >
          New file
        </button>
      </div>
    );
  }

  return null;
}
