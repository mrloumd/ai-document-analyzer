import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/60 pt-12 pb-8 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Top row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-3"
              suppressHydrationWarning
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-white"
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
              <span className="text-foreground font-semibold text-sm">
                StudyMind
              </span>
            </Link>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[180px]">
              Turn any document into summaries, tests, and presentations with
              AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-foreground text-xs font-semibold mb-3 uppercase tracking-wider">
              Product
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Analyze", href: "/analyze" },
                { label: "Top up Credits", href: "/upgrade" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted text-xs hover:text-foreground transition-colors"
                    suppressHydrationWarning
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-foreground text-xs font-semibold mb-3 uppercase tracking-wider">
              Resources
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Features", href: "/#features" },
                { label: "How it works", href: "/#how-it-works" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-muted text-xs hover:text-foreground transition-colors"
                    suppressHydrationWarning
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-foreground text-xs font-semibold mb-3 uppercase tracking-wider">
              Support
            </p>
            <ul className="space-y-2.5">
              {[{ label: "Contact", href: "/contact" }].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted text-xs hover:text-foreground transition-colors"
                    suppressHydrationWarning
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted text-xs">
            &copy; {year} StudyMind. All rights reserved.
          </p>
          {/* <p className="text-slate-700 text-xs">
            Built with Next.js &amp; TypeScript
          </p> */}
        </div>
      </div>
    </footer>
  );
}
