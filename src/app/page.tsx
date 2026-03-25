import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeroButtons, BannerCTA } from "@/components/HeroCTA";

const FEATURES = [
  {
    title: "AI Summary & Insights",
    desc: "Get structured summaries, key points, and strategic insights from any document in seconds — powered by GPT-4o-mini.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    iconColor: "text-brand-light",
    iconBg: "bg-brand-light/10 border-brand-light/20",
  },
  {
    title: "AI Test Generator",
    desc: "Automatically generate ready-to-print exams with multiple choice, fill-in-the-blanks, enumeration, and essay questions.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
    iconColor: "text-brand",
    iconBg: "bg-brand/10 border-brand/20",
  },
  {
    title: "AI Presentation Builder",
    desc: "Transform any document into a polished PowerPoint presentation. Choose your tone, set the slide count, and download your .pptx.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    ),
    iconColor: "text-brand-light",
    iconBg: "bg-brand-light/10 border-brand-light/20",
  },
  {
    title: "PDF & DOCX Parsing",
    desc: "Accurately extract text from complex layouts, tables, multi-column pages, and multi-page documents without losing context.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
    iconColor: "text-brand",
    iconBg: "bg-brand/10 border-brand/20",
  },
  {
    title: "Download in Any Format",
    desc: "Export your test as PDF or DOCX with a built-in answer key. Download your presentation as a .pptx file ready for PowerPoint.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    ),
    iconColor: "text-brand-light",
    iconBg: "bg-brand-light/10 border-brand-light/20",
  },
  {
    title: "Secure Cloud Storage",
    desc: "Documents are encrypted and stored securely on AWS S3. Your sensitive data is protected, private, and never shared.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
    iconColor: "text-brand",
    iconBg: "bg-brand/10 border-brand/20",
  },
];

const STATS = [
  { value: "3 Tools", label: "Summary, Test, Slides" },
  { value: "PDF & DOCX", label: "Input formats" },
  { value: "~30 sec", label: "Generation time" },
  { value: "PDF · DOCX · PPTX", label: "Export formats" },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Upload",
    desc: "Drop your PDF or DOCX into the upload zone. Text is securely extracted from your document.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
    ),
  },
  {
    step: "2",
    title: "Choose a Mode",
    desc: "Select Summary for instant insights, Generate Test to build an exam, or Presentation to create a slide deck.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
  },
  {
    step: "3",
    title: "Generate & Download",
    desc: "Processes your document and delivers a polished output you can download and use immediately.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1 pt-16">
        {/* -- Hero -- */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-brand/10 blur-[120px]" />
            <div className="absolute top-20 left-1/4 w-[400px] h-[300px] rounded-full bg-brand-dark/8 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand/25 bg-brand/10 text-brand-light text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              3 AI-powered tools in one
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white mb-6">
              Summaries, Tests &amp; Slides{" "}
              <span className="bg-gradient-to-r from-brand-light via-brand to-brand-dark bg-clip-text text-transparent">
                from Any Document
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              Upload a PDF or DOCX and instantly generate AI-powered summaries,
              exam questions, or PowerPoint presentations — all from a single
              tool.
            </p>

            {/* CTA Buttons */}
            <HeroButtons />

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-white/5 pt-10">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <span className="text-white font-semibold text-base">
                    {s.value}
                  </span>
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
                  <span className="text-[10px] text-emerald-400 font-medium">
                    Generated
                  </span>
                </div>
              </div>

              {/* Mode toggle */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/8 mb-4 w-fit">
                {[
                  { label: "Summary", active: false },
                  { label: "Test", active: false },
                  { label: "Presentation", active: true },
                ].map(({ label, active }) => (
                  <div
                    key={label}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      active ? "bg-brand text-white" : "text-slate-500"
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* File row */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/[0.02] mb-4">
                <div className="w-7 h-7 rounded-md bg-brand/15 border border-brand/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-brand"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-2 w-40 rounded-full bg-white/20 mb-1.5" />
                  <div className="h-1.5 w-20 rounded-full bg-white/10" />
                </div>
                <div className="h-6 w-24 rounded-lg bg-brand/20 border border-brand/25" />
              </div>

              {/* Slide preview cards */}
              <div className="space-y-2.5">
                {[
                  { w: "w-32", bullets: 3 },
                  { w: "w-28", bullets: 4 },
                  { w: "w-36", bullets: 3 },
                ].map((slide, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/8 bg-white/[0.02] p-3 flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-brand/15 border border-brand/25 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1.5">
                      <div
                        className={`h-2 ${slide.w} rounded-full bg-white/20`}
                      />
                      <div className="space-y-1 pt-0.5">
                        {Array.from({ length: slide.bullets }).map((_, j) => (
                          <div key={j} className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand/50 shrink-0" />
                            <div
                              className="h-1.5 rounded-full bg-white/10"
                              style={{ width: `${60 + ((i + j) % 3) * 12}%` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* -- Features -- */}
        <section
          id="features"
          className="border-t border-white/5 bg-white/[0.01] py-20 px-6"
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand/20 bg-brand/8 text-brand-light text-xs font-medium mb-4">
                Features
              </div>
              <h2 className="text-white font-bold text-3xl sm:text-4xl mb-4">
                One document, three powerful outputs
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                StudyMind turns your documents into summaries, exams, and
                presentations — so you can teach, share, and present faster.
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
                  <h3 className="text-white font-semibold text-base mb-2">
                    {f.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -- Use cases -- */}
        <section className="border-t border-white/5 py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand/20 bg-brand/8 text-brand-light text-xs font-medium mb-4">
                Use Cases
              </div>
              <h2 className="text-white font-bold text-3xl sm:text-4xl mb-4">
                Built for educators, students &amp; professionals
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                Whether you are in a classroom or a boardroom, StudyMind saves
                you hours.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  role: "Teachers",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                      />
                    </svg>
                  ),
                  points: [
                    "Generate tests from lecture notes or textbooks",
                    "Create slide decks from syllabi or reports",
                    "Export exams as PDF with answer keys",
                  ],
                },
                {
                  role: "Students",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                  ),
                  points: [
                    "Summarize long readings into key points",
                    "Self-quiz with auto-generated practice tests",
                    "Turn research papers into presentation slides",
                  ],
                },
                {
                  role: "Professionals",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                      />
                    </svg>
                  ),
                  points: [
                    "Summarize reports and policy documents fast",
                    "Build presentations from internal docs in minutes",
                    "Extract key insights before a meeting",
                  ],
                },
              ].map((uc) => (
                <div
                  key={uc.role}
                  className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-brand/25 hover:bg-white/[0.035] transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl border border-brand/20 bg-brand/10 text-brand flex items-center justify-center mb-4">
                    {uc.icon}
                  </div>
                  <h3 className="text-white font-semibold text-base mb-4">
                    {uc.role}
                  </h3>
                  <ul className="space-y-2.5">
                    {uc.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-slate-400 text-sm"
                      >
                        <span className="text-brand mt-0.5 shrink-0">
                          &#9656;
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -- How it works -- */}
        <section
          id="how-it-works"
          className="border-t border-white/5 bg-white/[0.01] py-20 px-6"
        >
          <div className="mx-auto max-w-4xl text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand/20 bg-brand/8 text-brand-light text-xs font-medium mb-4">
              How it works
            </div>
            <h2 className="text-white font-bold text-3xl sm:text-4xl mb-3">
              From document to output in three steps
            </h2>
            <p className="text-slate-400 text-base">
              Upload once, generate anything — in under 30 seconds.
            </p>
          </div>

          <div className="mx-auto max-w-4xl grid sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-white/5 font-bold text-5xl leading-none select-none">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-xl border border-brand/20 bg-brand/10 text-brand-light flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
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
              Ready to work smarter with your documents?
            </h2>
            <BannerCTA />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
