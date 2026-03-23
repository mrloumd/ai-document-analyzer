"use client";

import React from "react";
import type { AnalysisResult } from "@/types";

interface ResultDisplayProps {
  result: AnalysisResult;
  fileName: string;
}

function SectionCard({
  icon,
  label,
  color,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] overflow-hidden">
      <div className={`px-5 py-4 border-b border-white/8 flex items-center gap-3 ${color}`}>
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="font-semibold text-sm tracking-wide uppercase opacity-80">
          {label}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${color}`} />
          <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ResultDisplay({ result, fileName }: ResultDisplayProps) {
  return (
    <section className="w-full animate-[fade-up_0.4s_ease-out]">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-xl">Analysis Results</h2>
          <p className="text-slate-400 text-sm mt-0.5 truncate max-w-xs">{fileName}</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-emerald-400 text-xs font-medium">AI Analysis Complete</span>
        </div>
      </div>

      {/* Summary — full width */}
      <SectionCard
        icon={
          <svg className="w-4 h-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        label="Summary"
        color="text-brand-light"
      >
        <p className="text-slate-300 text-sm leading-7 whitespace-pre-line">
          {result.summary}
        </p>
      </SectionCard>

      {/* Key Points + Insights — two columns on md+ */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <SectionCard
          icon={
            <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
          label="Key Points"
          color="text-brand"
        >
          <BulletList items={result.keyPoints} color="bg-brand" />
        </SectionCard>

        <SectionCard
          icon={
            <svg className="w-4 h-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
          label="Key Insights"
          color="text-brand-light"
        >
          <BulletList items={result.insights} color="bg-brand-light" />
        </SectionCard>
      </div>
    </section>
  );
}
