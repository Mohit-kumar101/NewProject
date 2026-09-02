import Link from "next/link";
import { Bookmark, Package, CreditCard, Bell } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { mergeDashboardAlerts, purchaseDaysLeft } from "@/lib/vaultline/dashboard";
import { getCurrentUser } from "@/lib/vaultline/session";
import { AlertsTimelineClient } from "@/components/vaultline/AlertsTimelineClient";
import { SavedCalculationsList } from "@/components/vaultline/SavedCalculationsList";
import { ReturnCountdown } from "@/components/vaultline/DashboardPanels";

export default async function VaultlineDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [saved, savedCount, purchases, subscriptions, dbAlerts] = await Promise.all([
    prisma.savedCalculation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.savedCalculation.count({ where: { userId: user.id } }),
    prisma.purchase.findMany({
      where: { userId: user.id, status: "active" },
      orderBy: { returnDeadline: "asc" },
      take: 10,
    }),
    prisma.subscription.findMany({
      where: { userId: user.id, status: "active" },
      orderBy: { nextRenewalDate: "asc" },
    }),
    prisma.alert.findMany({
      where: { userId: user.id, status: { not: "dismissed" } },
      orderBy: { dueAt: "asc" },
      take: 20,
    }),
  ]);

  const alerts = mergeDashboardAlerts(dbAlerts, purchases, subscriptions);
  const serializedSaved = saved.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
          Your free account — saved calculator results, purchases, and
          subscriptions sync here when you sign in.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Saved tools",
            value: savedCount,
            icon: Bookmark,
            href: "/vaultline/saved",
          },
          {
            label: "Purchases",
            value: purchases.length,
            icon: Package,
            href: "/vaultline/purchases",
          },
          {
            label: "Subscriptions",
            value: subscriptions.length,
            icon: CreditCard,
            href: "/vaultline/subscriptions",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--muted)]">{stat.label}</p>
                <Icon className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Recent saved results</h2>
          <Link
            href="/vaultline/saved"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            View all
          </Link>
        </div>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Calculator outputs you saved while signed in.
        </p>
        <div className="mt-4">
          <SavedCalculationsList items={serializedSaved} />
        </div>
      </section>

      {purchases.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold">Return countdowns</h2>
          <ul className="mt-4 space-y-3">
            {purchases.slice(0, 4).map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <p className="font-semibold text-sm">{p.itemName}</p>
                <ReturnCountdown
                  itemName={p.itemName}
                  retailer={p.retailer}
                  daysLeft={purchaseDaysLeft(p.returnDeadline)}
                  returnDeadline={p.returnDeadline?.toISOString() ?? null}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {alerts.length > 0 ? (
        <section id="alerts">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Bell className="h-5 w-5 text-[var(--accent)]" />
            Reminders
          </h2>
          <div className="mt-4">
            <AlertsTimelineClient initialAlerts={alerts.slice(0, 8)} />
          </div>
        </section>
      ) : null}

      <p className="text-xs text-[var(--muted)]">
        All calculators and tools on CalculioHub are free. Sign in to keep your
        data across devices.
      </p>
    </div>
  );
}
