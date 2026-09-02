import { Package } from "lucide-react";

export function ReturnCountdown({
  itemName,
  retailer,
  daysLeft,
  returnDeadline,
}: {
  itemName: string;
  retailer: string | null;
  daysLeft: number | null;
  returnDeadline: string | null;
}) {
  if (!returnDeadline || daysLeft === null) return null;

  const urgent = daysLeft <= 3;
  const pct = Math.max(0, Math.min(100, (daysLeft / 30) * 100));

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-[var(--muted)]">
          <Package className="h-3 w-3" />
          {retailer ?? "Retailer"}
        </span>
        <span
          className={
            urgent ? "font-semibold text-red-500" : "text-[var(--accent)]"
          }
        >
          {daysLeft <= 0
            ? "Return window closed"
            : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className={`h-full rounded-full transition-all ${
            urgent ? "bg-red-500" : "bg-[var(--accent)]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-[var(--muted)]">
        {itemName} · return by{" "}
        {new Date(returnDeadline).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}
      </p>
    </div>
  );
}
