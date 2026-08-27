/**
 * Durable-ish subscriber store.
 * - Always appends to data/subscribers.json when the filesystem is writable (local).
 * - On Vercel, file writes may not persist across deploys — use Resend Audience too.
 */

import { promises as fs } from "fs";
import path from "path";

export type SubscriberRecord = {
  email: string;
  source: string;
  at: string;
};

const STORE_PATH = path.join(process.cwd(), "data", "subscribers.json");

async function readAll(): Promise<SubscriberRecord[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as SubscriberRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addSubscriber(
  email: string,
  source: string
): Promise<{ saved: boolean; duplicate: boolean; total: number }> {
  const list = await readAll();
  const exists = list.some((r) => r.email === email);
  if (exists) {
    return { saved: true, duplicate: true, total: list.length };
  }

  list.push({
    email,
    source,
    at: new Date().toISOString(),
  });

  try {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(list, null, 2) + "\n", "utf8");
    return { saved: true, duplicate: false, total: list.length };
  } catch (err) {
    console.warn("[subscribers] could not write file (common on serverless):", err);
    return { saved: false, duplicate: false, total: list.length };
  }
}

export async function listSubscribers(): Promise<SubscriberRecord[]> {
  return readAll();
}
