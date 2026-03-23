"use client";

import { useState } from "react";
import type {
  GeneratedTest,
  MultipleChoiceQuestion,
  FillInTheBlanksQuestion,
  EnumerationQuestion,
  EssayQuestion,
} from "@/types";
import DownloadButton from "./DownloadButton";

interface TestResultDisplayProps {
  test: GeneratedTest;
  fileName: string;
}

// -- Section container --
function Section({
  roman,
  title,
  directions,
  count,
  color,
  icon,
  children,
}: {
  roman: string;
  title: string;
  directions: string;
  count: number;
  color: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] overflow-hidden">
      {/* Section header */}
      <div
        className={`px-5 py-4 border-b border-white/8 flex items-center justify-between ${color}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider uppercase opacity-90">
              {roman}. {title}
            </span>
            <p className="text-xs opacity-60 mt-0.5 font-normal">
              {directions}
            </p>
          </div>
        </div>
        <span className="text-xs opacity-60 shrink-0 ml-4">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </div>
      <div className="p-5 space-y-5">{children}</div>
    </div>
  );
}

// -- Question number badge --
function QNum({ n }: { n: number }) {
  return (
    <span className="w-6 h-6 rounded-full bg-brand/15 border border-brand/25 text-brand text-xs font-bold flex items-center justify-center shrink-0">
      {n}
    </span>
  );
}

// -- Multiple Choice --
function MCQuestion({
  q,
  n,
  showAnswer,
}: {
  q: MultipleChoiceQuestion;
  n: number;
  showAnswer: boolean;
}) {
  return (
    <div className="flex gap-3">
      <QNum n={n} />
      <div className="flex-1">
        <p className="text-slate-200 text-sm mb-2.5">{q.question}</p>
        <div className="grid sm:grid-cols-2 gap-1.5">
          {q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isCorrect = showAnswer && letter === q.answer;
            return (
              <div
                key={i}
                className={[
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                  isCorrect
                    ? "bg-emerald-500/12 border border-emerald-500/25 text-emerald-300"
                    : "bg-white/[0.03] border border-white/5 text-slate-400",
                ].join(" ")}
              >
                <span
                  className={[
                    "w-5 h-5 rounded text-xs font-bold flex items-center justify-center shrink-0",
                    isCorrect
                      ? "bg-emerald-500/25 text-emerald-300"
                      : "bg-white/8 text-slate-500",
                  ].join(" ")}
                >
                  {letter}
                </span>
                <span>{opt.replace(/^[A-D]\.\s*/, "")}</span>
              </div>
            );
          })}
        </div>
        {showAnswer && (
          <p className="mt-2 text-xs text-emerald-400 font-medium">
            Answer: {q.answer}
          </p>
        )}
      </div>
    </div>
  );
}

// -- Fill in the Blanks --
function FIBQuestion({
  q,
  n,
  showAnswer,
}: {
  q: FillInTheBlanksQuestion;
  n: number;
  showAnswer: boolean;
}) {
  return (
    <div className="flex gap-3">
      <QNum n={n} />
      <div className="flex-1">
        <p className="text-slate-200 text-sm">{q.question}</p>
        {showAnswer && (
          <p className="mt-1.5 text-xs text-brand-light font-medium">
            Answer:{" "}
            <span className="underline underline-offset-2">{q.answer}</span>
          </p>
        )}
      </div>
    </div>
  );
}

// -- Enumeration --
function EnumQuestion({
  q,
  n,
  showAnswer,
}: {
  q: EnumerationQuestion;
  n: number;
  showAnswer: boolean;
}) {
  return (
    <div className="flex gap-3">
      <QNum n={n} />
      <div className="flex-1">
        <p className="text-slate-200 text-sm mb-2">{q.question}</p>
        <div className="space-y-1.5 pl-2">
          {Array.from({ length: q.answers.length }, (_, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-slate-600 text-xs w-4 shrink-0">
                {i + 1}.
              </span>
              {showAnswer ? (
                <span className="text-brand-light text-sm">{q.answers[i]}</span>
              ) : (
                <div className="h-px flex-1 bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -- Essay --
function EssayQuestion({
  q,
  n,
  showAnswer,
}: {
  q: EssayQuestion;
  n: number;
  showAnswer: boolean;
}) {
  return (
    <div className="flex gap-3">
      <QNum n={n} />
      <div className="flex-1">
        <p className="text-slate-200 text-sm">{q.question}</p>
        {q.hint && showAnswer && (
          <p className="mt-1.5 text-xs text-slate-500 italic">
            Guide: {q.hint}
          </p>
        )}
        {!showAnswer && (
          <div className="mt-3 space-y-1.5">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-px w-full bg-white/8" />
            ))}
          </div>
        )}
        {q.hint && !showAnswer && (
          <p className="mt-2 text-xs text-slate-600 italic">
            (Guide: {q.hint})
          </p>
        )}
      </div>
    </div>
  );
}

// -- Main Component --
export default function TestResultDisplay({
  test,
  fileName,
}: TestResultDisplayProps) {
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const total =
    test.multipleChoice.length +
    test.fillInTheBlanks.length +
    test.enumeration.length +
    test.essay.length;

  const mcStart = 1;
  const fibStart = mcStart + test.multipleChoice.length;
  const enumStart = fibStart + test.fillInTheBlanks.length;
  const essayStart = enumStart + test.enumeration.length;

  const formattedDate = new Date(test.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="w-full animate-[fade-up_0.4s_ease-out] space-y-6">
      {/* Header bar */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span className="text-brand-light text-xs font-medium">
                Test Generated
              </span>
            </div>
            <h2 className="text-white font-bold text-xl leading-tight">
              {test.title}
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              {total} questions &middot; Generated {formattedDate} &middot;{" "}
              <span className="text-slate-600 truncate">{fileName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Answer key toggle */}
            <button
              onClick={() => setShowAnswerKey((v) => !v)}
              className={[
                "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
                showAnswerKey
                  ? "bg-amber-500/15 border-amber-500/25 text-amber-300"
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20",
              ].join(" ")}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {showAnswerKey ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                ) : (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </>
                )}
              </svg>
              {showAnswerKey ? "Hide Key" : "Answer Key"}
            </button>

            <DownloadButton test={test} fileName={fileName} />
          </div>
        </div>

        {/* Instructions */}
        <p className="mt-4 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4 italic">
          {test.instructions}
        </p>
      </div>

      {/* Answer key notice */}
      {showAnswerKey && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/8">
          <svg
            className="w-4 h-4 text-amber-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
          <p className="text-amber-300 text-xs">
            <strong>Teacher mode active</strong> — answers are highlighted. Hide
            key before distributing to students.
          </p>
        </div>
      )}

      {/* I. Multiple Choice */}
      {test.multipleChoice.length > 0 && (
        <Section
          roman="I"
          title="Multiple Choice"
          directions="Choose the letter of the best answer."
          count={test.multipleChoice.length}
          color="text-brand-light"
          icon={
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        >
          {test.multipleChoice.map((q, i) => (
            <MCQuestion
              key={i}
              q={q}
              n={mcStart + i}
              showAnswer={showAnswerKey}
            />
          ))}
        </Section>
      )}

      {/* II. Fill in the Blanks */}
      {test.fillInTheBlanks.length > 0 && (
        <Section
          roman="II"
          title="Fill in the Blanks"
          directions="Write the correct word or phrase on the blank."
          count={test.fillInTheBlanks.length}
          color="text-brand"
          icon={
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          }
        >
          {test.fillInTheBlanks.map((q, i) => (
            <FIBQuestion
              key={i}
              q={q}
              n={fibStart + i}
              showAnswer={showAnswerKey}
            />
          ))}
        </Section>
      )}

      {/* III. Enumeration */}
      {test.enumeration.length > 0 && (
        <Section
          roman="III"
          title="Enumeration"
          directions="List the required items completely and in order."
          count={test.enumeration.length}
          color="text-brand-light"
          icon={
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
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          }
        >
          {test.enumeration.map((q, i) => (
            <EnumQuestion
              key={i}
              q={q}
              n={enumStart + i}
              showAnswer={showAnswerKey}
            />
          ))}
        </Section>
      )}

      {/* IV. Essay */}
      {test.essay.length > 0 && (
        <Section
          roman="IV"
          title="Essay"
          directions="Answer each question with a well-organized essay of at least 3-5 sentences."
          count={test.essay.length}
          color="text-brand"
          icon={
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        >
          {test.essay.map((q, i) => (
            <EssayQuestion
              key={i}
              q={q}
              n={essayStart + i}
              showAnswer={showAnswerKey}
            />
          ))}
        </Section>
      )}
    </section>
  );
}
