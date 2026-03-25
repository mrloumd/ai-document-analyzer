"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/analyze" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-brand/8 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-8 shadow-2xl shadow-black/60 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-xl shadow-brand/30">
              <svg
                className="w-7 h-7 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">
                Welcome to StudyMind
                {/* <span className="text-brand-light"> AI</span> */}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Sign in to start analyzing your documents
              </p>
            </div>
          </div>

          {/* Free credit callout */}
          <div className="flex items-center gap-2.5 rounded-xl border border-brand/20 bg-brand/8 px-4 py-3 mb-6">
            <div className="w-7 h-7 rounded-lg bg-brand/20 flex items-center justify-center shrink-0">
              <svg
                className="w-3.5 h-3.5 text-brand-light"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-300">
              You&apos;ll receive{" "}
              <span className="text-brand-light font-semibold">
                3 free credit
              </span>{" "}
              on signup
            </p>
          </div>

          {/* Google sign-in button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 animate-spin text-slate-500"
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
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isLoading ? "Signing in…" : "Continue with Google"}
          </button>

          <p className="text-center text-xs text-slate-600 mt-5">
            By signing in, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  );
}
