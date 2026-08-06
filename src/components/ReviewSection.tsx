"use client";

import { FormEvent, useMemo, useState } from "react";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Aisha K.",
    rating: 5,
    comment:
      "Clean layout and the results update instantly. Exactly what I needed for a quick planning check.",
    date: "Mar 12, 2026",
  },
  {
    id: "r2",
    name: "Daniel R.",
    rating: 4,
    comment:
      "Very usable on mobile. Would love a save/export option later, but the math feels solid.",
    date: "Feb 28, 2026",
  },
  {
    id: "r3",
    name: "Priya S.",
    rating: 5,
    comment:
      "The FAQ section answered my questions before I even had to search. Smooth dark mode too.",
    date: "Feb 3, 2026",
  },
  {
    id: "r4",
    name: "Marcus L.",
    rating: 5,
    comment:
      "Simple inputs, clear outputs. This replaced three bookmarks I used to juggle.",
    date: "Jan 19, 2026",
  },
];

function StarIcon({
  filled,
  className = "",
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      className={className}
      aria-hidden
    >
      <path
        d="M12 3.6l2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 15.9l-4.8 2.52.92-5.34L4.24 9.24l5.36-.78L12 3.6z"
        fill={filled ? "url(#starGrad)" : "none"}
        stroke={filled ? "url(#starGrad)" : "currentColor"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarRow({
  rating,
  interactive = false,
  hoverValue = 0,
  onHover,
  onSelect,
}: {
  rating: number;
  interactive?: boolean;
  hoverValue?: number;
  onHover?: (value: number) => void;
  onSelect?: (value: number) => void;
}) {
  const display = interactive && hoverValue > 0 ? hoverValue : rating;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => onHover?.(0)}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#2979FF" />
          </linearGradient>
        </defs>
      </svg>
      {[1, 2, 3, 4, 5].map((value) => {
        const filled = value <= display;
        if (!interactive) {
          return (
            <StarIcon
              key={value}
              filled={filled}
              className={filled ? "" : "text-[var(--border)]"}
            />
          );
        }
        return (
          <button
            key={value}
            type="button"
            aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
            className="rounded-md p-0.5 transition hover:scale-110"
            onMouseEnter={() => onHover?.(value)}
            onFocus={() => onHover?.(value)}
            onClick={() => onSelect?.(value)}
          >
            <StarIcon
              filled={filled}
              className={filled ? "" : "text-[var(--muted)]"}
            />
          </button>
        );
      })}
    </div>
  );
}

export function ReviewSection({
  toolTitle,
  toolUrl,
}: {
  toolTitle: string;
  toolUrl: string;
}) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const aggregateSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: toolTitle,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: toolUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(average.toFixed(1)),
      bestRating: 5,
      worstRating: 1,
      ratingCount: reviews.length,
      reviewCount: reviews.length,
    },
    review: reviews.slice(0, 4).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      datePublished: review.date,
      reviewBody: review.comment,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !comment.trim() || rating < 1 || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "review",
          toolTitle,
          toolUrl,
          name: name.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Could not send review.");
      }

      const next: Review = {
        id: `local-${Date.now()}`,
        name: name.trim(),
        rating,
        comment: comment.trim(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      setReviews((prev) => [next, ...prev]);
      setName("");
      setComment("");
      setRating(5);
      setSubmitted(true);
      window.setTimeout(() => setSubmitted(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-16 scroll-mt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateSchema) }}
      />

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_20px_50px_-36px_rgba(41,121,255,0.45)]">
        <div className="border-b border-[var(--border)] bg-gradient-to-r from-[rgba(0,229,255,0.08)] to-[rgba(41,121,255,0.08)] px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
                Community
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
                Reviews & Ratings
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
                See what others think about this tool, then leave your own
                rating to help improve CalculioHub.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 text-center sm:min-w-[160px]">
              <p className="result-glow font-[family-name:var(--font-display)] text-3xl font-bold">
                {average.toFixed(1)}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">out of 5.0</p>
              <div className="mt-2 flex justify-center">
                <StarRow rating={Math.round(average)} />
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <form
            onSubmit={onSubmit}
            className="border-b border-[var(--border)] p-5 sm:p-6 lg:border-r lg:border-b-0"
          >
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Leave a review
            </h3>
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-[var(--muted)]">
                Your rating
              </p>
              <StarRow
                rating={rating}
                interactive
                hoverValue={hoverRating}
                onHover={setHoverRating}
                onSelect={setRating}
              />
            </div>
            <label className="mt-5 block">
              <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                Name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                maxLength={60}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                Review
              </span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What worked well? What could be clearer?"
                required
                rows={4}
                maxLength={500}
                className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(41,121,255,0.8)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending…" : "Submit review"}
            </button>
            {error && (
              <p className="mt-3 text-sm text-red-500" role="alert">
                {error}
              </p>
            )}
            {submitted && (
              <p className="mt-3 animate-[rise-in_0.35s_ease] text-sm font-medium text-[var(--accent)]">
                Thanks! Your review was added and sent.
              </p>
            )}
          </form>

          <div className="max-h-[420px] space-y-3 overflow-y-auto p-5 sm:p-6">
            {reviews.map((review, index) => (
              <article
                key={review.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition hover:border-[var(--accent)]"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {review.name}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      {review.date}
                    </p>
                  </div>
                  <StarRow rating={review.rating} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
