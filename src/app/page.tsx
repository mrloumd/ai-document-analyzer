import Link from "next/link";
import Header from "@/components/Header";

const FEATURES = [
  {
    title: "PDF & DOCX Parsing",
    desc: "Extract text from any standard document. Handles complex layouts, tables, headers, and multi-page documents with high accuracy.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    iconColor: "text-brand-light",
    iconBg: "bg-brand-light/10 border-brand-light/20",
  },
  {
    title: "AI-Powered Analysis",
    desc: "Leverage OpenAI's large language models to deeply understand your document's context and semantics, generating comprehensive insights.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
    iconColor: "text-brand",
    iconBg: "bg-brand/10 border-brand/20",
  },
  {
    title: "Structured Summaries",
    desc: "Get clean, organized summaries that capture the core message of your document without information overload.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    iconColor: "text-brand-light",
    iconBg: "bg-brand-light/10 border-brand-light/20",
  },
  {
    title: "Key Points Extraction",
    desc: "Automatically surface the most critical information from any document, saving you hours of manual reading and note-taking.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    iconColor: "text-brand",
    iconBg: "bg-brand/10 border-brand/20",
  },
  {
    title: "Strategic Insights",
    desc: "Uncover actionable patterns and insights that help you make informed decisions based on your document's content.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    iconColor: "text-brand-light",
    iconBg: "bg-brand-light/10 border-brand-light/20",
  },
  {
    title: "Secure Cloud Storage",
    desc: "Documents are encrypted and stored securely on AWS S3. Your sensitive data is protected and private at all times.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    iconColor: "text-brand",
    iconBg: "bg-brand/10 border-brand/20",
  },
];

const STATS = [
  { value: "PDF & DOCX", label: "Formats" },
  { value: "10 MB", label: "Max file size" },
  { value: "~30 sec", label: "Processing time" },
  { value: "AWS S3", label: "Cloud storage" },
];

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1 pt-16">
        {/* -- Hero -- */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-brand/10 blur-[120px]" />
            <div className="absolute top-20 left-1/4 w-[400px] h-[300px] rounded-full bg-brand-dark/8 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand/25 bg-brand/10 text-brand-light text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              Powered by OpenAI
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white mb-6">
              Extract AI Insights from{" "}
              <span className="bg-gradient-to-r from-brand-light via-brand to-brand-dark bg-clip-text text-transparent">
                Any Document
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              Upload a PDF or DOCX and instantly receive a structured summary,
              key points, and strategic insights — all powered by OpenAI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
              <Link
                href="/analyze"
                className="px-6 py-3 rounded-xl bg-brand hover:bg-brand-light text-white font-semibold text-sm transition-colors flex items-center gap-2"
                suppressHydrationWarning
              >
                Start Analyzing
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#features"
                className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 font-medium text-sm transition-colors"
                suppressHydrationWarning
              >
                See Features
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-white/5 pt-10">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <span className="text-white font-semibold text-base">{s.value}</span>
                  <span className="text-slate-500 text-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* App preview mockup */}
          <div className="relative mx-auto max-w-2xl px-6 pb-24">
            <div className="rounded-2xl border border-white/10 bg-[#040d0d] p-5 shadow-2xl shadow-black/60">
              {/* Chrome bar */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/8" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/8" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/8" />
                </div>
                <div className="flex-1 h-4 rounded-md bg-white/[0.04] mx-2" />
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-emerald-500/20 bg-emerald-500/8">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-medium">Analysis complete</span>
                </div>
              </div>

              {/* File row */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/[0.02] mb-4">
                <div className="w-7 h-7 rounded-md bg-brand/15 border border-brand/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-2 w-40 rounded-full bg-white/20 mb-1.5" />
                  <div className="h-1.5 w-20 rounded-full bg-white/10" />
                </div>
              </div>

              {/* Summary card */}
              <div className="rounded-xl border border-brand-light/15 bg-brand/5 p-4 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md bg-brand-light/15" />
                  <div className="h-1.5 w-14 rounded-full bg-brand-light/25" />
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 rounded-full bg-white/10 w-full" />
                  <div className="h-1.5 rounded-full bg-white/10 w-11/12" />
                  <div className="h-1.5 rounded-full bg-white/10 w-4/5" />
                  <div className="h-1.5 rounded-full bg-white/10 w-3/4" />
                </div>
              </div>

              {/* Key Points + Insights */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-brand/15 bg-brand/5 p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 rounded bg-brand/20" />
                    <div className="h-1.5 w-14 rounded-full bg-brand/25" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand/40 shrink-0" />
                      <div className="h-1.5 rounded-full bg-white/10 w-4/5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand/40 shrink-0" />
                      <div className="h-1.5 rounded-full bg-white/10 w-full" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand/40 shrink-0" />
                      <div className="h-1.5 rounded-full bg-white/10 w-3/4" />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-brand-light/15 bg-brand-light/5 p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 rounded bg-brand-light/20" />
                    <div className="h-1.5 w-14 rounded-full bg-brand-light/25" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-light/40 shrink-0" />
                      <div className="h-1.5 rounded-full bg-white/10 w-full" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-light/40 shrink-0" />
                      <div className="h-1.5 rounded-full bg-white/10 w-3/5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-light/40 shrink-0" />
                      <div className="h-1.5 rounded-full bg-white/10 w-4/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -- Features -- */}
        <section id="features" className="border-t border-white/5 bg-white/[0.01] py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand/20 bg-brand/8 text-brand-light text-xs font-medium mb-4">
                Features
              </div>
              <h2 className="text-white font-bold text-3xl sm:text-4xl mb-4">
                Everything you need to understand
                <br className="hidden sm:block" /> your documents
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                StudyMind AI extracts meaning from your documents so you don't have to read everything yourself.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-brand/25 hover:bg-white/[0.035] transition-all duration-200"
                >
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.iconColor} ${f.iconBg}`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -- How it works -- */}
        <section id="how-it-works" className="border-t border-white/5 py-20 px-6">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand/20 bg-brand/8 text-brand-light text-xs font-medium mb-4">
              How it works
            </div>
            <h2 className="text-white font-bold text-3xl sm:text-4xl mb-3">
              Three steps to instant insights
            </h2>
            <p className="text-slate-400 text-base">
              From upload to analysis in under 30 seconds.
            </p>
          </div>

          <div className="mx-auto max-w-4xl grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Upload",
                desc: "Drop your PDF or DOCX into the upload zone. Your document is securely transmitted for processing.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                ),
                color: "text-brand-light bg-brand/10 border-brand/20",
              },
              {
                step: "02",
                title: "Extract",
                desc: "Text is extracted from your document and sent securely to the AI for deep, contextual analysis.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                color: "text-brand bg-brand/10 border-brand/20",
              },
              {
                step: "03",
                title: "Analyze",
                desc: "OpenAI generates a structured summary, key points, and strategic insights about your document.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                color: "text-brand-dark bg-brand/10 border-brand/20",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-white/5 font-bold text-5xl leading-none select-none">
                  {item.step}
                </div>
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -- CTA Banner -- */}
        <section className="border-t border-white/5 py-24 px-6 relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-brand/10 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-white font-bold text-3xl sm:text-4xl mb-4">
              Ready to unlock your document insights?
            </h2>
            <p className="text-slate-400 text-base mb-8 max-w-md mx-auto">
              Upload your first document and get AI-powered analysis in seconds. No sign-up required.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand hover:bg-brand-light text-white font-semibold text-base transition-colors"
              suppressHydrationWarning
            >
              Start Analyzing
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* -- Footer -- */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            StudyMind AI
          </span>
          <span>Built with Next.js, TypeScript &amp; OpenAI</span>
        </div>
      </footer>
    </>
  );
}
