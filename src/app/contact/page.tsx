"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const INITIAL: FormState = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Failed to send.");
      setSuccess(true);
      setForm(INITIAL);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 pt-16">
        {/* -- Page header -- */}
        <section className="relative overflow-hidden border-b border-border">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full bg-brand/8 blur-[80px]" />
          </div>
          <div className="relative mx-auto max-w-3xl px-6 pt-10 pb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors mb-5 group"
              suppressHydrationWarning
            >
              <svg
                className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              Contact
            </h1>
            <p className="text-muted text-sm">
             Got a question, feedback, spotted a bug, or just want to connect?
            </p>
          </div>
        </section>

        {/* -- Content -- */}
        <section className="mx-auto max-w-3xl px-6 py-10">
          <div className="grid sm:grid-cols-5 gap-10">
            {/* Left - info */}
            <div className="sm:col-span-2 space-y-6">
              <div>
                <p className="text-foreground font-semibold text-sm mb-1">Email</p>
                <p className="text-muted text-sm">You&apos;ll receive a response within 24 hours.</p>
              </div>
              <div>
                <p className="text-foreground font-semibold text-sm mb-1">Support</p>
                <p className="text-muted text-sm">
                  For billing, credits, or account issues — include your account
                  email in the message.
                </p>
              </div>
              <div>
                <p className="text-foreground font-semibold text-sm mb-1">Feedback</p>
                <p className="text-muted text-sm">
                  Feature requests and bug reports are always welcome.
                </p>
              </div>
            </div>

            {/* Right - form */}
            <div className="sm:col-span-3">
              {success ? (
                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-6 py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-foreground font-semibold text-base mb-1">Message sent!</p>
                  <p className="text-muted text-sm">
                    Thanks for reaching out. I&apos;ll get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-5 text-brand-light text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-border bg-surface p-6 space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">
                        Name
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="w-full rounded-xl border border-border bg-surface-raised px-3.5 py-2.5 text-sm text-foreground placeholder-muted focus:outline-none focus:border-brand/50 focus:bg-surface-raised transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-border bg-surface-raised px-3.5 py-2.5 text-sm text-foreground placeholder-muted focus:outline-none focus:border-brand/50 focus:bg-surface-raised transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">
                      Subject
                    </label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                      className="w-full rounded-xl border border-border bg-surface-raised px-3.5 py-2.5 text-sm text-foreground placeholder-muted focus:outline-none focus:border-brand/50 focus:bg-surface-raised transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us more..."
                      className="w-full rounded-xl border border-border bg-surface-raised px-3.5 py-2.5 text-sm text-foreground placeholder-muted focus:outline-none focus:border-brand/50 focus:bg-surface-raised transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-rose-400 text-xs">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send message
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
