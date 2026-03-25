"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";

type PackId = "starter" | "pro";

async function createCheckout(packId: PackId): Promise<string> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packId }),
  });
  const data = await res.json();
  if (!res.ok || !data.url)
    throw new Error(data.error ?? "Failed to create checkout session.");
  return data.url;
}

export default function UpgradePage() {
  const { data: session } = useSession();
  const credits = session?.user?.credits ?? 0;
  const [loading, setLoading] = useState<PackId | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy(packId: PackId) {
    setLoading(packId);
    setError(null);
    try {
      const url = await createCheckout(packId);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(null);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-16 min-h-screen">
        {/* Page header */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[250px] rounded-full bg-brand/8 blur-[80px]" />
          </div>
          <div className="relative mx-auto max-w-3xl px-6 pt-10 pb-8">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-5 group"
              suppressHydrationWarning
            >
              <svg
                className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Analyze
            </Link>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Top Up Credits
              </h1>
              <p className="text-slate-400 text-sm">
                Pay once, use anytime. No subscription.
                {session && (
                  <span className="ml-2 text-slate-500">
                    You have{" "}
                    <span
                      className={
                        credits > 0 ? "text-emerald-400" : "text-rose-400"
                      }
                    >
                      {credits} credit{credits !== 1 ? "s" : ""}
                    </span>
                    .
                  </span>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="mx-auto max-w-3xl px-6 py-10">
          {error && (
            <div className="mb-6 rounded-xl border border-rose-500/25 bg-rose-500/8 px-4 py-3 text-rose-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Starter */}
            <div className="rounded-3xl border border-white/8 bg-white/[0.015] p-6 md:p-8 shadow-2xl shadow-black/40 flex flex-col">
              <div className="mb-5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-slate-400 font-medium mb-4">
                  Starter
                </div>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-white">$3</span>
                  <span className="text-slate-500 text-sm mb-1.5">
                    one-time
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1">5 credits</p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {[
                  "Analyze 5 documents",
                  "Generate 5 tests",
                  "Generate 5 presentations",
                  "Credits never expire",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-slate-400"
                  >
                    <svg
                      className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuy("starter")}
                disabled={!!loading}
                className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading === "starter" ? (
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
                    Redirecting...
                  </>
                ) : (
                  "Buy for $3"
                )}
              </button>
            </div>

            {/* Pro */}
            <div className="rounded-3xl border border-brand/40 bg-brand/[0.04] p-6 md:p-8 shadow-2xl shadow-brand/10 flex flex-col relative overflow-hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute top-0 right-0 w-40 h-40 rounded-full bg-brand/10 blur-[50px]"
              />

              <div className="mb-5 relative">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-brand/30 bg-brand/15 text-xs text-brand-light font-medium mb-4">
                  Best value
                </div>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-white">$9</span>
                  <span className="text-slate-500 text-sm mb-1.5">
                    one-time
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1">20 credits</p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1 relative">
                {[
                  "Analyze 20 documents",
                  "Generate 20 tests",
                  "Generate 20 presentations",
                  "Credits never expire",
                  "4x more credits",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <svg
                      className="w-4 h-4 text-brand-light shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuy("pro")}
                disabled={!!loading}
                className="w-full py-3 rounded-xl bg-brand hover:bg-brand-light text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative shadow-lg shadow-brand/25"
              >
                {loading === "pro" ? (
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
                    Redirecting...
                  </>
                ) : (
                  "Buy for $9"
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            Payments processed securely by PayMongo. No credit card data is
            stored on our servers.
          </p>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            StudyMind
          </span>
          <span>Built with Next.js &amp; TypeScript</span>
        </div>
      </footer>
    </>
  );
}
