/**
 * Local backup for review / suggestion / contact submissions.
 * Writable locally; on Vercel the filesystem is ephemeral — email remains the
 * primary delivery path, but we still attempt a write and always log.
 */

import { promises as fs } from "fs";
import path from "path";

export type FeedbackRecord = {
  id: string;
  type: "review" | "suggestion" | "contact";
  toolTitle?: string;
  toolUrl?: string;
  name?: string;
  email?: string;
  rating?: number;
  comment?: string;
  category?: string;
  message?: string;
  at: string;
  emailId?: string | null;
};

const STORE_PATH = path.join(process.cwd(), "data", "feedback.json");

async function readAll(): Promise<FeedbackRecord[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as FeedbackRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addFeedbackRecord(
  record: Omit<FeedbackRecord, "id" | "at"> & { at?: string }
): Promise<{ saved: boolean; id: string }> {
  const id = `fb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const entry: FeedbackRecord = {
    ...record,
    id,
    at: record.at || new Date().toISOString(),
  };

  const list = await readAll();
  list.unshift(entry);
  // Cap local file growth
  const trimmed = list.slice(0, 500);

  try {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(
      STORE_PATH,
      JSON.stringify(trimmed, null, 2) + "\n",
      "utf8"
    );
    return { saved: true, id };
  } catch (err) {
    console.warn("[feedback] could not write file (common on serverless):", err);
    return { saved: false, id };
  }
}

export async function listFeedbackRecords(): Promise<FeedbackRecord[]> {
  return readAll();
}
