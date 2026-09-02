import { getCurrentUser } from "@/lib/vaultline/session";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Your Vaultline account</p>
      </div>

      <dl className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
        <div className="px-4 py-3">
          <dt className="text-xs text-[var(--muted)]">Email</dt>
          <dd className="font-medium">{user.email}</dd>
        </div>
        <div className="px-4 py-3">
          <dt className="text-xs text-[var(--muted)]">Name</dt>
          <dd className="font-medium">{user.name || "—"}</dd>
        </div>
        <div className="px-4 py-3">
          <dt className="text-xs text-[var(--muted)]">Plan</dt>
          <dd className="font-medium">Free — all tools included</dd>
        </div>
      </dl>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
        <p className="font-semibold text-[var(--foreground)]">What&apos;s included</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Save calculator results across the site</li>
          <li>Track purchases and return windows</li>
          <li>Track subscriptions and renewals</li>
          <li>In-app reminders — no paywall</li>
        </ul>
      </div>
    </div>
  );
}
