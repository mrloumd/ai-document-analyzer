"use client";

import { useState } from "react";
import type { PPTConfig } from "@/types";

interface PPTConfigFormProps {
  isEnabled: boolean;
  isGenerating: boolean;
  error: string | null;
  onGenerate: (config: PPTConfig) => void;
}

const TONES: { value: PPTConfig["tone"]; label: string; description: string }[] = [
  { value: "formal", label: "Formal", description: "Professional, structured, business-ready" },
  { value: "simple", label: "Simple", description: "Clear, accessible, plain language" },
  { value: "academic", label: "Academic", description: "Scholarly, precise, research-grade" },
];

function toInt(v: string): number {
  const n = parseInt(v, 10);
  return isNaN(n) ? 0 : n;
}

export default function PPTConfigForm({
  isEnabled,
  isGenerating,
  error,
  onGenerate,
}: PPTConfigFormProps) {
  const [numSlides, setNumSlides] = useState<string>("8");
  const [tone, setTone] = useState<PPTConfig["tone"]>("formal");

  const n = toInt(numSlides);
  const isValidSlides = Number.isInteger(n) && n >= 3 && n <= 20;
  const canSubmit = isEnabled && !isGenerating && isValidSlides;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onGenerate({ numSlides: n, tone });
  };

  const statusColor =
    numSlides === ""
      ? ""
      : isValidSlides
      ? "text-emerald-400"
      : "text-rose-400";

  const statusMsg =
    numSlides === ""
      ? null
      : isValidSlides
      ? `Ready — ${n} slide${n === 1 ? "" : "s"}, ${tone} tone`
      : "Enter a number between 3 and 20";

  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.015] p-6 md:p-8 shadow-2xl shadow-black/40">
      {/* Header */}
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
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-white font-semibold text-base">Presentation Settings</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Configure your AI-generated slide deck
          </p>
        </div>
      </div>

      {!isEnabled && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/8 px-4 py-3 text-sm text-slate-500">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Upload a document above to unlock presentation generation.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Number of slides */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Number of slides
            <span className="ml-2 text-xs text-slate-500 font-normal">(3–20)</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min={3}
              max={20}
              value={numSlides}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || (/^\d+$/.test(v) && parseInt(v) <= 20)) setNumSlides(v);
              }}
              disabled={isGenerating}
              className="w-24 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-brand/50 focus:bg-white/[0.06] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex gap-2">
              {[5, 8, 10, 15].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNumSlides(String(n))}
                  disabled={isGenerating}
                  className="px-2.5 py-1 rounded-md text-xs font-medium border border-white/10 text-slate-400 hover:text-white hover:border-brand/40 hover:bg-brand/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tone selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Presentation tone
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TONES.map(({ value, label, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTone(value)}
                disabled={isGenerating}
                className={[
                  "flex flex-col gap-1 px-3 py-3 rounded-xl border text-left transition-all duration-150 disabled:cursor-not-allowed",
                  tone === value
                    ? "bg-brand/15 border-brand/40 text-white"
                    : "bg-white/[0.02] border-white/8 text-slate-400 hover:border-white/15 hover:text-slate-300",
                ].join(" ")}
              >
                <span className="text-sm font-semibold leading-none">{label}</span>
                <span className="text-xs opacity-70 leading-tight">{description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status indicator */}
        {statusMsg && (
          <div className={`flex items-center gap-2 text-sm ${statusColor}`}>
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                isValidSlides ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
            {statusMsg}
          </div>
        )}

        {/* Generation error */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-400">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand hover:bg-brand-light text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand"
        >
          {isGenerating ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating…
            </>
          ) : (
            <>
              Generate Presentation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
