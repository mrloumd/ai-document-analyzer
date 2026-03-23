"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#040e0e]/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
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
            DocuMind<span className="text-brand-light"> AI</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-400">
          <a href="/#features" className="hover:text-white transition-colors" suppressHydrationWarning>
            Features
          </a>
          <a href="/#how-it-works" className="hover:text-white transition-colors" suppressHydrationWarning>
            How it works
          </a>
          <Link
            href="/analyze"
            className="px-4 py-1.5 rounded-lg bg-brand-dark hover:bg-brand text-white transition-colors font-medium"
          >
            Get started
          </Link>
        </nav>

        {/* Mobile hamburger placeholder */}
        <button className="md:hidden text-slate-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
