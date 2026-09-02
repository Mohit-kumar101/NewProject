import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/vaultline/session";
import { PurchaseManager } from "@/components/vaultline/PurchaseManager";

export default async function PurchasesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const purchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    orderBy: { purchaseDate: "desc" },
  });

  const serialized = purchases.map((p) => ({
    ...p,
    purchaseDate: p.purchaseDate.toISOString(),
    returnDeadline: p.returnDeadline?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Purchases
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Manually track purchases and return windows — saved to your free account.
        </p>
      </div>

      <PurchaseManager initial={serialized} />
    </div>
  );
}
