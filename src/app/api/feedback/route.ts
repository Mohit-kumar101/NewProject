import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.FEEDBACK_TO_EMAIL || "mohit.k3089@gmail.com";
const FROM_EMAIL =
  process.env.FEEDBACK_FROM_EMAIL || "CalculioHub <onboarding@resend.dev>";

type FeedbackBody = {
  type?: "review" | "suggestion" | "contact";
  toolTitle?: string;
  toolUrl?: string;
  name?: string;
  email?: string;
  rating?: number;
  comment?: string;
  category?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Email is not configured yet. Add RESEND_API_KEY in your environment.",
        },
        { status: 503 }
      );
    }

    const body = (await request.json()) as FeedbackBody;
    const type = body.type;

    if (type !== "review" && type !== "suggestion" && type !== "contact") {
      return NextResponse.json(
        { ok: false, error: "Invalid feedback type." },
        { status: 400 }
      );
    }

    const toolTitle = (body.toolTitle || "Unknown tool").trim();
    const toolUrl = (body.toolUrl || "").trim();

    let subject = "";
    let html = "";
    let replyTo: string | undefined;

    if (type === "review") {
      const name = (body.name || "").trim();
      const comment = (body.comment || "").trim();
      const rating = Number(body.rating);

      if (!name || !comment || !Number.isFinite(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
          { ok: false, error: "Name, comment, and a 1–5 rating are required." },
          { status: 400 }
        );
      }

      subject = `New review (${rating}/5) — ${toolTitle}`;
      html = `
        <h2>New CalculioHub Review</h2>
        <p><strong>Tool:</strong> ${escapeHtml(toolTitle)}</p>
        ${toolUrl ? `<p><strong>URL:</strong> <a href="${escapeHtml(toolUrl)}">${escapeHtml(toolUrl)}</a></p>` : ""}
        <p><strong>Rating:</strong> ${rating} / 5</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Comment:</strong></p>
        <p>${escapeHtml(comment).replaceAll("\n", "<br/>")}</p>
      `;
    } else if (type === "contact") {
      const name = (body.name || "").trim();
      const email = (body.email || "").trim();
      const message = (body.message || "").trim();

      if (!name || !email || !message || !isValidEmail(email)) {
        return NextResponse.json(
          {
            ok: false,
            error: "Name, a valid email, and a message are required.",
          },
          { status: 400 }
        );
      }

      subject = `Contact form — ${name}`;
      replyTo = email;
      html = `
        <h2>New CalculioHub Contact Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br/>")}</p>
      `;
    } else {
      const category = (body.category || "General Feedback").trim();
      const message = (body.message || "").trim();

      if (!message) {
        return NextResponse.json(
          { ok: false, error: "Suggestion message is required." },
          { status: 400 }
        );
      }

      subject = `New suggestion (${category}) — ${toolTitle}`;
      html = `
        <h2>New CalculioHub Suggestion</h2>
        <p><strong>Tool:</strong> ${escapeHtml(toolTitle)}</p>
        ${toolUrl ? `<p><strong>URL:</strong> <a href="${escapeHtml(toolUrl)}">${escapeHtml(toolUrl)}</a></p>` : ""}
        <p><strong>Category:</strong> ${escapeHtml(category)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br/>")}</p>
      `;
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message || "Failed to send email." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
