import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/vaultline/session";
import { SavedCalculationsList } from "@/components/vaultline/SavedCalculationsList";

export default async function SavedPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const saved = await prisma.savedCalculation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const serialized = saved.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
        Saved tools
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Calculator results you saved from CalculioHub.
      </p>
      <div className="mt-6">
        <SavedCalculationsList items={serialized} />
      </div>
    </div>
  );
}
