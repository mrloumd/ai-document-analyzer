"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

function CreditBadge({ credits }: { credits: number }) {
  const color =
    credits >= 2
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : credits === 1
        ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
        : "text-rose-400 border-rose-500/30 bg-rose-500/10";

  const tip =
    credits >= 2
      ? `${credits} credits — good to go`
      : credits === 1
        ? "1 credit left — running low"
        : "No credits — top up to continue";

  return (
    <span
      title={tip}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${color}`}
    >
      <svg
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {credits} credit{credits !== 1 ? "s" : ""}
    </span>
  );
}

function UserMenu({
  name,
  image,
  credits,
}: {
  name: string;
  image?: string | null;
  credits: number;
}) {
  const [open, setOpen] = useState(false);
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-white/5 transition-colors"
      >
        <CreditBadge credits={credits} />
        <div className="w-8 h-8 rounded-full overflow-hidden bg-brand/30 border border-brand/30 flex items-center justify-center text-xs font-bold text-brand-light">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-52 z-50 rounded-2xl border border-white/8 bg-[#091818] shadow-2xl shadow-black/60 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-white text-sm font-semibold truncate">
                {name}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                {credits > 0
                  ? `${credits} credit${credits !== 1 ? "s" : ""} left`
                  : "No credits left"}
              </p>
            </div>
            {credits === 0 && (
              <div className="px-4 py-2.5 bg-amber-500/8 border-b border-amber-500/15">
                <p className="text-amber-400 text-xs font-medium">
                  Out of credits
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Top up to keep going
                </p>
              </div>
            )}
            <Link
              href="/upgrade"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-brand-light hover:bg-brand/10 transition-colors"
              suppressHydrationWarning
            >
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Top up
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#040e0e]/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          suppressHydrationWarning
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-lg shadow-brand/30">
            <svg
              className="w-4.5 h-4.5 text-white"
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
          <span className="text-white font-semibold text-base tracking-tight">
            StudyMind
            {/* <span className="text-brand-light"> AI</span> */}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <a
            href="/#features"
            className="hover:text-white transition-colors"
            suppressHydrationWarning
          >
            Features
          </a>
          <a
            href="/#how-it-works"
            className="hover:text-white transition-colors"
            suppressHydrationWarning
          >
            How it works
          </a>

          {status === "loading" && (
            <div className="w-24 h-8 rounded-xl bg-white/5 animate-pulse" />
          )}
          {status === "unauthenticated" && (
            <Link
              href="/analyze"
              className="px-4 py-1.5 rounded-lg bg-brand-dark hover:bg-brand text-white transition-colors font-medium"
              suppressHydrationWarning
            >
              Get started
            </Link>
          )}
          {status === "authenticated" && session?.user && (
            <UserMenu
              name={session.user.name ?? "User"}
              image={session.user.image}
              credits={session.user.credits ?? 0}
            />
          )}
        </nav>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          {status === "authenticated" && session?.user && (
            <UserMenu
              name={session.user.name ?? "User"}
              image={session.user.image}
              credits={session.user.credits ?? 0}
            />
          )}
          {status === "unauthenticated" && (
            <Link
              href="/analyze"
              className="px-3 py-1.5 rounded-lg bg-brand-dark text-white text-sm font-medium"
              suppressHydrationWarning
            >
              Get started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
