"use client";

import { useState } from "react";

/**
 * Email capture for growth.
 * Saves the visitor to YOUR list (owner notification + file / Resend Audience).
 * The visitor does NOT get an email from this form.
 */
export function EmailCapture({
  source,
  headline = "Get a note when we add a planner",
  subtext = "Occasional email when something new is worth opening. We never share your address. Unsubscribe anytime.",
}: {
  source: string;
  headline?: string;
  subtext?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error || "Could not subscribe. Try again later.");
        return;
      }
      setStatus("ok");
      setMessage("You're on the list. We'll email only when we add something worth opening.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  };

  return (
    <section className="mt-12 max-w-3xl calc-panel rounded-2xl p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
        {headline}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{subtext}</p>
      <form
        onSubmit={submit}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <label className="sr-only" htmlFor={`email-capture-${source}`}>
          Email
        </label>
        <input
          id={`email-capture-${source}`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-60 dark:text-[#041018] dark:hover:brightness-105"
        >
          {status === "loading" ? "Saving…" : "Join free list"}
        </button>
      </form>
      {message ? (
        <p
          className={`mt-2 text-xs ${
            status === "ok" ? "text-[var(--accent)]" : "text-red-500"
          }`}
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
