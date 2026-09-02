import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/vaultline/session";
import { SubscriptionManager } from "@/components/vaultline/SubscriptionManager";

export default async function SubscriptionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: user.id },
    orderBy: { nextRenewalDate: "asc" },
  });

  const serialized = subscriptions.map((s) => ({
    ...s,
    nextRenewalDate: s.nextRenewalDate.toISOString(),
  }));

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
        Subscriptions
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Know what renews and when — cancel waste before it hits.
      </p>
      <div className="mt-6">
        <SubscriptionManager initial={serialized} />
      </div>
    </div>
  );
}
