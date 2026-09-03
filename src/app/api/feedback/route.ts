import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE_SUPPORT_EMAIL } from "@/lib/calculators";
import {
  addFeedbackRecord,
  listFeedbackRecords,
} from "@/lib/feedbackStore";

function parseRecipients(raw: string | undefined, fallback: string) {
  const list = (raw || fallback)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return list.length > 0 ? list : [fallback];
}

const TO_EMAILS = parseRecipients(
  process.env.FEEDBACK_TO_EMAIL,
  SITE_SUPPORT_EMAIL
);
const FROM_EMAIL =
  process.env.FEEDBACK_FROM_EMAIL ||
  "CalculioHub <noreply@mail.calculiohub.com>";

const LIST_SECRET = process.env.SUBSCRIBERS_SECRET?.trim();

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

function getResend() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  return apiKey ? new Resend(apiKey) : null;
}

/**
 * GET — export recent feedback (owner only).
 * /api/feedback?key=YOUR_SUBSCRIBERS_SECRET
 */
export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key") || "";
  if (!LIST_SECRET || key !== LIST_SECRET) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized. Set SUBSCRIBERS_SECRET and pass ?key=...",
      },
      { status: 401 }
    );
  }

  const records = await listFeedbackRecords();
  return NextResponse.json({
    ok: true,
    count: records.length,
    recipients: TO_EMAILS,
    from: FROM_EMAIL,
    feedback: records,
  });
}

export async function POST(request: Request) {
  try {
    const resend = getResend();
    if (!resend) {
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
    let text = "";
    let replyTo: string | undefined;
    let storePayload: Parameters<typeof addFeedbackRecord>[0] = {
      type,
      toolTitle,
      toolUrl: toolUrl || undefined,
    };

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

      subject = `[CalculioHub] New review (${rating}/5) — ${toolTitle}`;
      html = `
        <h2>New CalculioHub Review</h2>
        <p><strong>Tool:</strong> ${escapeHtml(toolTitle)}</p>
        ${toolUrl ? `<p><strong>URL:</strong> <a href="${escapeHtml(toolUrl)}">${escapeHtml(toolUrl)}</a></p>` : ""}
        <p><strong>Rating:</strong> ${rating} / 5</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Comment:</strong></p>
        <p>${escapeHtml(comment).replaceAll("\n", "<br/>")}</p>
      `;
      text = `New review (${rating}/5) for ${toolTitle}\nName: ${name}\n\n${comment}${toolUrl ? `\n\n${toolUrl}` : ""}`;
      storePayload = { ...storePayload, name, rating, comment };
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

      subject = `[CalculioHub] Contact form — ${name}`;
      replyTo = email;
      html = `
        <h2>New CalculioHub Contact Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br/>")}</p>
      `;
      text = `Contact from ${name} <${email}>\n\n${message}`;
      storePayload = { ...storePayload, name, email, message };
    } else {
      const category = (body.category || "General Feedback").trim();
      const message = (body.message || "").trim();

      if (!message) {
        return NextResponse.json(
          { ok: false, error: "Suggestion message is required." },
          { status: 400 }
        );
      }

      subject = `[CalculioHub] New suggestion (${category}) — ${toolTitle}`;
      html = `
        <h2>New CalculioHub Suggestion</h2>
        <p><strong>Tool:</strong> ${escapeHtml(toolTitle)}</p>
        ${toolUrl ? `<p><strong>URL:</strong> <a href="${escapeHtml(toolUrl)}">${escapeHtml(toolUrl)}</a></p>` : ""}
        <p><strong>Category:</strong> ${escapeHtml(category)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br/>")}</p>
      `;
      text = `Suggestion (${category}) for ${toolTitle}\n\n${message}${toolUrl ? `\n\n${toolUrl}` : ""}`;
      storePayload = { ...storePayload, category, message };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAILS,
      subject,
      html,
      text,
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      console.error("[feedback] Resend send failed:", error);
      await addFeedbackRecord({ ...storePayload, emailId: null });
      return NextResponse.json(
        { ok: false, error: error.message || "Failed to send email." },
        { status: 502 }
      );
    }

    const stored = await addFeedbackRecord({
      ...storePayload,
      emailId: data?.id ?? null,
    });

    console.info("[feedback] sent", {
      type,
      to: TO_EMAILS,
      emailId: data?.id,
      stored: stored.saved,
    });

    return NextResponse.json({
      ok: true,
      emailId: data?.id ?? null,
      stored: stored.saved,
    });
  } catch (err) {
    console.error("[feedback]", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
