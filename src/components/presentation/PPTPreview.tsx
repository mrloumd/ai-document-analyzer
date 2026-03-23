"use client";

import type { GeneratedPresentation } from "@/types";
import PPTDownloadButton from "@/components/presentation/PPTDownloadButton";

interface PPTPreviewProps {
  presentation: GeneratedPresentation;
  fileName: string;
}

export default function PPTPreview({
  presentation,
  fileName,
}: PPTPreviewProps) {
  const date = new Date(presentation.generatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="animate-[fade-up_0.4s_ease-out] space-y-4">
      {/* Header card */}
      <div className="rounded-3xl border border-white/8 bg-white/[0.015] p-6 md:p-8 shadow-2xl shadow-black/40">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span className="text-brand-light text-xs font-semibold uppercase tracking-widest">
                Presentation Generated
              </span>
            </div>
            <h2 className="text-white font-bold text-xl leading-snug mb-2 break-words">
              {presentation.title}
            </h2>
            <p className="text-slate-500 text-xs">
              {presentation.slides.length} slides &middot; Generated {date}{" "}
              &middot; <span className="text-slate-400">{fileName}</span>
            </p>
          </div>
          <div className="shrink-0">
            <PPTDownloadButton
              presentation={presentation}
              fileName={fileName}
            />
          </div>
        </div>
      </div>

      {/* Slide cards */}
      <div className="space-y-3">
        {presentation.slides.map((slide) => (
          <div
            key={slide.slideNumber}
            className="rounded-2xl border border-white/8 bg-white/[0.015] p-5 shadow-lg shadow-black/20 hover:border-brand/20 transition-colors"
          >
            {/* Slide header */}
            <div className="flex items-start gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand/15 border border-brand/25 text-brand text-xs font-bold shrink-0 mt-0.5">
                {slide.slideNumber}
              </span>
              <h3 className="text-white font-semibold text-sm leading-snug">
                {slide.title}
              </h3>
            </div>

            {/* Divider */}
            <div className="border-t border-white/5 mb-3 ml-9" />

            {/* Bullets */}
            <ul className="ml-9 space-y-1.5">
              {slide.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-slate-300 text-sm leading-relaxed"
                >
                  <span className="text-brand shrink-0 mt-0.5 text-xs">
                    &#9656;
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-center pt-2">
        <PPTDownloadButton presentation={presentation} fileName={fileName} />
      </div>
    </div>
  );
}
