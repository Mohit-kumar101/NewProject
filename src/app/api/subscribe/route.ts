import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE_SUPPORT_EMAIL } from "@/lib/calculators";
import { addSubscriber, listSubscribers } from "@/lib/subscribers";
import {
  addContactToList,
  ensureSubscriberSegmentId,
  listResendContacts,
} from "@/lib/resendAudience";

/** Where YOUR owner alerts go (not the subscriber). */
const OWNER_EMAIL =
  process.env.SUBSCRIBE_TO_EMAIL ||
  process.env.FEEDBACK_TO_EMAIL ||
  SITE_SUPPORT_EMAIL;

const FROM_EMAIL =
  process.env.FEEDBACK_FROM_EMAIL ||
  "CalculioHub <noreply@mail.calculiohub.com>";

const LIST_SECRET = process.env.SUBSCRIBERS_SECRET?.trim();

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  return apiKey ? new Resend(apiKey) : null;
}

/**
 * GET — export YOUR collected list.
 * /api/subscribe?key=YOUR_SUBSCRIBERS_SECRET
 */
export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key") || "";
  if (!LIST_SECRET || key !== LIST_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Set SUBSCRIBERS_SECRET and pass ?key=..." },
      { status: 401 }
    );
  }

  const fileList = await listSubscribers();
  const resend = getResend();
  let resendContacts: { email: string }[] = [];
  let resendError: string | undefined;

  if (resend) {
    const segment = await ensureSubscriberSegmentId(
      resend,
      process.env.RESEND_AUDIENCE_ID?.trim()
    );
    const listed = await listResendContacts(resend, segment.id);
    resendContacts = listed.contacts;
    resendError = listed.error;
  }

  const emails = new Set<string>();
  const merged: { email: string; source?: string; at?: string; via: string }[] =
    [];
  for (const r of fileList) {
    emails.add(r.email);
    merged.push({ ...r, via: "file" });
  }
  for (const c of resendContacts) {
    if (emails.has(c.email)) continue;
    emails.add(c.email);
    merged.push({ email: c.email, via: "resend" });
  }

  return NextResponse.json({
    ok: true,
    count: merged.length,
    subscribers: merged,
    resendError: resendError ?? null,
  });
}

/**
 * POST — visitor joins the list.
 * Saves to Resend contacts (live-safe) + local file when possible, then emails YOU.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; source?: string };
    const email = (body.email || "").trim().toLowerCase();
    const source = (body.source || "unknown").slice(0, 80);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const store = await addSubscriber(email, source);
    const resend = getResend();
    let ownerNotified = false;
    let resendContactSaved = false;
    let resendError: string | undefined;

    if (resend) {
      const segment = await ensureSubscriberSegmentId(
        resend,
        process.env.RESEND_AUDIENCE_ID?.trim()
      );
      const added = await addContactToList(
        resend,
        email,
        source,
        segment.id
      );
      resendContactSaved = added.saved;
      resendError = added.error || segment.error;

      const webhook = process.env.SUBSCRIBER_WEBHOOK_URL?.trim();
      if (webhook) {
        try {
          await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, source, at: new Date().toISOString() }),
          });
        } catch (webhookErr) {
          console.warn("[subscribe] webhook failed:", webhookErr);
        }
      }

      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: `[CalculioHub OWNER] New list signup: ${email}`,
        html: `
          <h2>New email for YOUR list (owner alert only)</h2>
          <p>This went to <strong>${OWNER_EMAIL}</strong>. The visitor was not emailed.</p>
          <p><strong>Copy this subscriber:</strong> ${email}</p>
          <ul>
            <li><strong>Page:</strong> ${source}</li>
            <li><strong>Saved in Resend Contacts:</strong> ${
              resendContactSaved
                ? "yes — see Resend → Contacts / CalculioHub subscribers"
                : added.restricted || segment.restricted
                  ? "NO — your Resend API key is Sending-only. Create a Full access key and replace RESEND_API_KEY on Vercel."
                  : `no (${resendError || "unknown"})`
            }</li>
            <li><strong>Server file:</strong> ${store.saved ? "yes" : "no (normal on Vercel)"}</li>
          </ul>
        `,
        text: `OWNER ALERT (not sent to visitor)\nSubscriber: ${email}\nSource: ${source}\nResend saved: ${resendContactSaved}\n`,
      });

      if (error) {
        console.error("[subscribe] owner notify failed:", error);
      } else {
        ownerNotified = true;
      }
    }

    return NextResponse.json({
      ok: true,
      savedToFile: store.saved,
      duplicate: store.duplicate,
      ownerNotified,
      resendContactSaved,
    });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json(
      { ok: false, error: "Could not subscribe right now." },
      { status: 500 }
    );
  }
}
