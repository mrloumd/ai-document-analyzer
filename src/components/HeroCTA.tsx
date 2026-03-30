"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const arrowRight = (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

export function HeroButtons() {
  const { status } = useSession();
  const loggedIn = status === "authenticated";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
      <Link
        href="/analyze"
        className="px-6 py-3 rounded-xl bg-brand hover:bg-brand-light text-white font-semibold text-sm transition-colors flex items-center gap-2"
        suppressHydrationWarning
      >
        {loggedIn ? "Start Analyzing" : "Start for Free"}
        {arrowRight}
      </Link>
      <a
        href="#features"
        className="px-6 py-3 rounded-xl border border-border text-muted hover:text-foreground hover:border-foreground/20 font-medium text-sm transition-colors"
        suppressHydrationWarning
      >
        See Features
      </a>
    </div>
  );
}

export function BannerCTA() {
  const { status } = useSession();
  const loggedIn = status === "authenticated";

  return (
    <>
      <p className="text-muted text-base mb-10 max-w-md mx-auto">
        {loggedIn
          ? "Upload a document and generate a summary, test, or presentation in seconds."
          : "Summarize, test, and present — all from a single file upload. Sign up for 3 free credits."}
      </p>
      <Link
        href="/analyze"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand hover:bg-brand-light text-white font-semibold text-base transition-colors"
        suppressHydrationWarning
      >
        {loggedIn ? "Go to Analyze" : "Start for Free"}
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    </>
  );
}
