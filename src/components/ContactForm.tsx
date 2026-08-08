"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Could not send your message.");
      }
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center sm:p-8">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF]" />
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--foreground)]">
          Message sent
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Thanks for reaching out. We’ll get back to you as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-5 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
            Name
          </label>
          <input
            id="contact-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            placeholder="How can we help?"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-[#b91c1c] dark:text-[#f87171]">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-16px_rgba(0,229,255,0.85)] transition hover:brightness-105 disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
