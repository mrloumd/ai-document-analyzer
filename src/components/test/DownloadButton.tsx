"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { GeneratedTest } from "@/types";

interface DownloadButtonProps {
  test: GeneratedTest;
  fileName: string;
}

type DownloadFormat = "pdf" | "docx";

async function triggerDownload(test: GeneratedTest, format: DownloadFormat, name: string) {
  const res = await fetch("/api/download-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test, format, fileName: name }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Download failed.");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function DownloadButton({ test, fileName }: DownloadButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<DownloadFormat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDownload = useCallback(
    async (format: DownloadFormat) => {
      setOpen(false);
      setError(null);
      setLoading(format);
      try {
        const safeName =
          fileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_\- ]/g, "").trim() || test.title;
        await triggerDownload(test, format, safeName);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Download failed.");
      } finally {
        setLoading(null);
      }
    },
    [test, fileName]
  );

  const options: { format: DownloadFormat; label: string; ext: string; icon: React.ReactNode }[] = [
    {
      format: "pdf",
      label: "PDF Document",
      ext: ".pdf",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      ),
    },
    {
      format: "docx",
      label: "Word Document",
      ext: ".docx",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={!!loading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand/15 hover:bg-brand/25 border border-brand/25 text-brand-light text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Preparing {loading.toUpperCase()}…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-white/10 bg-[#071212] shadow-xl shadow-black/60 z-20 overflow-hidden">
          {options.map(({ format, label, ext, icon }) => (
            <button
              key={format}
              onClick={() => handleDownload(format)}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-colors"
            >
              <span className="text-brand-light">{icon}</span>
              <span className="flex-1 text-left">{label}</span>
              <span className="text-slate-600 text-xs">{ext}</span>
            </button>
          ))}
        </div>
      )}

      {/* Inline error */}
      {error && (
        <p className="absolute top-full left-0 mt-1.5 text-xs text-red-400 whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}
