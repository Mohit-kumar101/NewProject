/**
 * Auto-provision a Resend segment so live deploys keep a contact list.
 * Requires a Resend API key with full access (not "sending access" only).
 */

import type { Resend } from "resend";

export const LIST_NAME = "CalculioHub subscribers";

function isRestrictedKey(message?: string) {
  return /restricted to only send emails/i.test(message || "");
}

export async function ensureSubscriberSegmentId(
  resend: Resend,
  preferredId?: string
): Promise<{ id: string | null; error?: string; restricted?: boolean }> {
  if (preferredId) return { id: preferredId };

  const listed = await resend.segments.list();
  if (listed.error) {
    return {
      id: null,
      error: listed.error.message,
      restricted: isRestrictedKey(listed.error.message),
    };
  }

  const existing = listed.data?.data?.find((s) => s.name === LIST_NAME);
  if (existing?.id) return { id: existing.id };

  const created = await resend.segments.create({ name: LIST_NAME });
  if (created.error) {
    return {
      id: null,
      error: created.error.message,
      restricted: isRestrictedKey(created.error.message),
    };
  }
  return { id: created.data?.id ?? null };
}

export async function addContactToList(
  resend: Resend,
  email: string,
  source: string,
  segmentId: string | null
): Promise<{ saved: boolean; error?: string; restricted?: boolean }> {
  const result = await resend.contacts.create({
    email,
    unsubscribed: false,
    lastName: source.slice(0, 40),
    ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
  });

  if (result.error) {
    return {
      saved: false,
      error: result.error.message,
      restricted: isRestrictedKey(result.error.message),
    };
  }
  return { saved: true };
}

export async function listResendContacts(
  resend: Resend,
  segmentId: string | null
) {
  const result = await resend.contacts.list(
    segmentId ? { segmentId } : undefined
  );
  if (result.error) {
    return {
      contacts: [] as { email: string }[],
      error: result.error.message,
      restricted: isRestrictedKey(result.error.message),
    };
  }
  const contacts = (result.data?.data ?? []).map((c) => ({
    email: c.email,
  }));
  return { contacts };
}
