"use client";

import { useState } from "react";
import type { PPTConfig, PPTTemplate } from "@/types";

interface PPTConfigFormProps {
  isEnabled: boolean;
  isGenerating: boolean;
  error: string | null;
  onGenerate: (config: PPTConfig) => void;
  plan?: "free" | "paid" | "unpaid";
}

const TEMPLATES: {
  value: PPTTemplate;
  label: string;
  description: string;
  preview: { bg: string; strip: string; accent: string };
}[] = [
  {
    value: "default",
    label: "Default - Dark",
    description: "Dark teal — always free",
    preview: { bg: "#040e0e", strip: "#040e0e", accent: "#1E9AA0" },
  },
  {
    value: "light",
    label: "Light",
    description: "Clean white, teal accents",
    preview: { bg: "#f0fdfa", strip: "#0d9488", accent: "#0d9488" },
  },
  {
    value: "dark",
    label: "Classic",
    description: "Black & white, print-ready",
    preview: { bg: "#ffffff", strip: "#1a1a1a", accent: "#1a1a1a" },
  },
];

const TONES: {
  value: PPTConfig["tone"];
  label: string;
  description: string;
}[] = [
  {
    value: "formal",
    label: "Formal",
    description: "Professional, structured, business-ready",
  },
  {
    value: "simple",
    label: "Simple",
    description: "Clear, accessible, plain language",
  },
  {
    value: "academic",
    label: "Academic",
    description: "Scholarly, precise, research-grade",
  },
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
  plan = "free",
}: PPTConfigFormProps) {
  const isFree = plan === "free";
  const maxSlides = isFree ? 5 : 20;
  const [numSlides, setNumSlides] = useState<string>(isFree ? "5" : "8");
  const [tone, setTone] = useState<PPTConfig["tone"]>("formal");
  const [template, setTemplate] = useState<PPTTemplate>("default");

  const n = toInt(numSlides);
  const isValidSlides = Number.isInteger(n) && n >= 3 && n <= maxSlides;
  const canSubmit = isEnabled && !isGenerating && isValidSlides;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onGenerate({ numSlides: n, tone, template });
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
    <div className="rounded-3xl border border-border bg-surface p-6 md:p-8 shadow-2xl shadow-black/40">
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
          <h2 className="text-foreground font-semibold text-base">
            Presentation Settings
          </h2>
          <p className="text-muted text-xs mt-0.5">
            Configure your AI-generated slide deck
          </p>
        </div>
      </div>

      {!isEnabled && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-surface-raised border border-border px-4 py-3 text-sm text-muted">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Upload a document above to unlock presentation generation.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Number of slides */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-3">
            Number of slides
            <span className="ml-2 text-xs text-muted font-normal">
              (3–{maxSlides})
            </span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min={3}
              max={maxSlides}
              value={numSlides}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || (/^\d+$/.test(v) && parseInt(v) <= maxSlides))
                  setNumSlides(v);
              }}
              disabled={isGenerating}
              className="w-24 bg-surface-raised border border-border rounded-lg px-3 py-2 text-foreground text-sm text-center focus:outline-none focus:border-brand/50 focus:bg-surface-raised transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex gap-2">
              {(isFree ? [3, 4, 5] : [5, 8, 10, 15]).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNumSlides(String(n))}
                  disabled={isGenerating}
                  className="px-2.5 py-1 rounded-md text-xs font-medium border border-border text-muted hover:text-foreground hover:border-brand/40 hover:bg-brand/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          {isFree && (
            <p className="text-xs text-amber-400/80 mt-2">
              Free accounts: up to 5 slides.{" "}
              <a
                href="/upgrade"
                className="underline underline-offset-2 hover:text-amber-300 transition-colors"
                suppressHydrationWarning
              >
                Top up to unlock more
              </a>
            </p>
          )}
        </div>

        {/* Tone selector */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-3">
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
                    ? "bg-brand/15 border-brand/40 text-foreground"
                    : "bg-surface border-border text-muted hover:border-foreground/15 hover:text-foreground/80",
                ].join(" ")}
              >
                <span className="text-sm font-semibold leading-none">
                  {label}
                </span>
                <span className="text-xs opacity-70 leading-tight">
                  {description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Template selector */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-3">
            Slide template
            {isFree && (
              <span className="ml-2 text-xs text-muted font-normal">
                Light &amp; Dark require credits
              </span>
            )}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATES.map(({ value, label, description, preview }) => {
              const locked = isFree && value !== "default";
              return (
                <div
                  key={value}
                  onClick={locked ? undefined : () => setTemplate(value)}
                  className={[
                    "relative flex flex-col gap-2 p-3 rounded-xl border text-left transition-all duration-150",
                    locked
                      ? "cursor-not-allowed opacity-50 border-border bg-surface"
                      : template === value
                        ? "cursor-pointer bg-brand/15 border-brand/40"
                        : "cursor-pointer bg-surface border-border hover:border-foreground/15",
                  ].join(" ")}
                >
                  {/* Mini slide preview */}
                  <div
                    className="w-full h-14 rounded-md overflow-hidden shrink-0"
                    style={{ background: preview.bg }}
                  >
                    <div
                      className="h-4 w-full flex items-center px-2"
                      style={{ background: preview.strip }}
                    >
                      <div
                        className="h-1.5 w-10 rounded-sm opacity-90"
                        style={{ background: preview.accent }}
                      />
                    </div>
                    <div className="px-2 pt-1.5 space-y-1">
                      <div className="h-1 w-8 rounded-sm opacity-50" style={{ background: preview.accent }} />
                      <div className="h-0.5 w-11 rounded-sm opacity-30" style={{ background: preview.accent }} />
                      <div className="h-0.5 w-7 rounded-sm opacity-30" style={{ background: preview.accent }} />
                    </div>
                  </div>
                  <div>
                    <p
                      className={[
                        "text-xs font-semibold leading-none mb-0.5",
                        locked
                          ? "text-muted"
                          : template === value
                            ? "text-foreground"
                            : "text-foreground/80",
                      ].join(" ")}
                    >
                      {label}
                      {locked && (
                        <svg
                          className="inline-block ml-1 w-3 h-3 text-muted"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      )}
                    </p>
                    <p className="text-[10px] text-muted leading-tight">
                      {locked ? "Available for purchased credits" : description}
                    </p>
                  </div>
                </div>
              );
            })}
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
            <svg
              className="w-4 h-4 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Credit notice */}
        {isEnabled && (
          <p className="text-center text-xs text-muted">
            Generating will use{" "}
            <span className="text-foreground/80 font-medium">1 credit</span>
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand hover:bg-brand-light text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand"
        >
          {isGenerating ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
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
              Generating…
            </>
          ) : (
            <>
              Generate Presentation
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
