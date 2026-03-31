"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function UpgradeSuccessPage() {
  const { update } = useSession();

  // Poll a few times with delays to wait for the webhook to update the DB,
  // then each call re-fetches fresh credit count from DB into the JWT.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const delays = [1000, 3000, 6000, 10000];
    const timers = delays.map((d) => setTimeout(() => update(), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          {/* Success icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Payment Successful!
          </h1>
          <p className="text-muted text-sm mb-8">
            Credits are ready. Go analyze something.
          </p>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-light text-white font-medium text-sm transition-colors shadow-lg shadow-brand/25"
            suppressHydrationWarning
          >
            Start analyzing
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
          </Link>

          <p className="text-muted text-xs mt-6">
            Credits not showing up?{" "}
            <Link
              href="/upgrade"
              className="text-muted hover:text-foreground transition-colors underline underline-offset-2"
              suppressHydrationWarning
            >
              Contact support
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
