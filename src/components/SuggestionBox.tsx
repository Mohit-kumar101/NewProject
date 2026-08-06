"use client";

import { FormEvent, useState } from "react";

const CATEGORIES = ["Feature Idea", "Bug Report", "General Feedback"] as const;

type Category = (typeof CATEGORIES)[number];

export function SuggestionBox({
  toolTitle,
  toolUrl = "",
}: {
  toolTitle: string;
  toolUrl?: string;
}) {
  const [category, setCategory] = useState<Category>("Feature Idea");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "suggestion",
          toolTitle,
          toolUrl,
          category,
          message: message.trim(),
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Could not send suggestion.");
      }

      setSuccess(true);
      setMessage("");
      setCategory("Feature Idea");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send suggestion.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setError("");
  };

  return (
    <section className="mt-10 scroll-mt-24">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#00E5FF33] to-[#2979FF22] blur-2xl" />

        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Improve this tool
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
            Suggestion Box
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            Share an idea, report a bug, or send general feedback for{" "}
            <span className="font-medium text-[var(--foreground)]">
              {toolTitle}
            </span>
            . Your input helps shape what we build next.
          </p>

          {success ? (
            <div className="mt-6 animate-[rise-in_0.4s_ease] rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF] to-[#2979FF] text-lg font-bold text-white">
                ✓
              </div>
              <p className="text-base font-semibold text-[var(--foreground)]">
                Thank you! Your suggestion has been recorded.
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                We review community feedback regularly.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-5 text-sm font-medium text-[var(--accent)] transition hover:underline"
              >
                Send another suggestion
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                  Category
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--accent)]"
                >
                  {CATEGORIES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                  Your suggestion
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  maxLength={800}
                  placeholder="How would you improve this calculator? Missing input, clearer result, new feature…"
                  className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </label>

              {error && (
                <p className="text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(41,121,255,0.8)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending…" : "Submit suggestion"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
