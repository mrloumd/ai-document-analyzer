"use client";

import { useState, useCallback } from "react";
import type { TestConfig } from "@/types";

interface TestConfigFormProps {
  /** True when a document has been extracted and is ready */
  isEnabled: boolean;
  isGenerating: boolean;
  error: string | null;
  onGenerate: (config: TestConfig) => void;
}

interface FormValues {
  total: string;
  multipleChoice: string;
  fillInTheBlanks: string;
  enumeration: string;
  essay: string;
}

const INITIAL: FormValues = {
  total: "",
  multipleChoice: "",
  fillInTheBlanks: "",
  enumeration: "",
  essay: "",
};

function toInt(v: string): number {
  const n = parseInt(v, 10);
  return isNaN(n) ? 0 : n;
}

const TYPES = [
  { key: "multipleChoice" as const, label: "Multiple Choice", icon: "A" },
  { key: "fillInTheBlanks" as const, label: "Fill in the Blanks", icon: "B" },
  { key: "enumeration" as const, label: "Enumeration", icon: "C" },
  { key: "essay" as const, label: "Essay", icon: "D" },
];

export default function TestConfigForm({
  isEnabled,
  isGenerating,
  error,
  onGenerate,
}: TestConfigFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL);

  const total = toInt(values.total);
  const mc = toInt(values.multipleChoice);
  const fib = toInt(values.fillInTheBlanks);
  const en = toInt(values.enumeration);
  const es = toInt(values.essay);
  const allocated = mc + fib + en + es;
  const remaining = total - allocated;

  const isValid =
    total >= 1 &&
    allocated === total &&
    mc >= 0 &&
    fib >= 0 &&
    en >= 0 &&
    es >= 0;

  const canSubmit = isValid && isEnabled && !isGenerating;

  const set = useCallback((key: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow empty, but prevent negatives and non-numeric
    if (raw === "" || /^\d+$/.test(raw)) {
      setValues((prev) => ({ ...prev, [key]: raw }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onGenerate({ total, multipleChoice: mc, fillInTheBlanks: fib, enumeration: en, essay: es });
  };

  const inputCls =
    "w-20 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-sm text-center font-mono focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.015] p-6 md:p-8 shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-brand/15 border border-brand/20 flex items-center justify-center shrink-0">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-white font-semibold text-base">Configure Test</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            {isEnabled
              ? "Set the number of questions for each type"
              : "Upload a document first to configure your test"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Total Questions */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-white/8 bg-white/[0.02]">
          <div>
            <p className="text-white text-sm font-medium">Total Questions</p>
            <p className="text-slate-500 text-xs mt-0.5">Set your target question count</p>
          </div>
          <input
            type="text"
            inputMode="numeric"
            className={`${inputCls} w-24 text-lg font-semibold`}
            value={values.total}
            onChange={set("total")}
            placeholder="20"
            disabled={!isEnabled || isGenerating}
            aria-label="Total questions"
          />
        </div>

        {/* Question Types */}
        <div className="space-y-2">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider px-1">
            Question Types
          </p>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden divide-y divide-white/5">
            {TYPES.map(({ key, label, icon }) => (
              <div key={key} className="flex items-center gap-4 px-4 py-3">
                <div className="w-6 h-6 rounded-md bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                  <span className="text-brand text-xs font-bold">{icon}</span>
                </div>
                <span className="text-slate-300 text-sm flex-1">{label}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  className={inputCls}
                  value={values[key]}
                  onChange={set(key)}
                  placeholder="0"
                  disabled={!isEnabled || isGenerating}
                  aria-label={`${label} count`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Allocation status */}
        {values.total !== "" && (
          <div
            className={[
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium",
              isValid
                ? "border border-emerald-500/20 bg-emerald-500/8 text-emerald-400"
                : remaining > 0
                ? "border border-amber-500/20 bg-amber-500/8 text-amber-400"
                : "border border-red-500/20 bg-red-500/8 text-red-400",
            ].join(" ")}
          >
            {isValid ? (
              <>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                All {total} questions allocated
              </>
            ) : remaining > 0 ? (
              <>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {allocated} of {total} allocated — {remaining} remaining
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {allocated} allocated exceeds total of {total}
              </>
            )}
          </div>
        )}

        {/* Generation error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-300 text-sm">{error}</p>
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
              Generate Test
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>

        {!isEnabled && (
          <p className="text-center text-slate-600 text-xs">
            Upload a document above to activate test generation.
          </p>
        )}
      </form>
    </div>
  );
}
