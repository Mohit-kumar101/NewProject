import Image from "next/image";
import Link from "next/link";

export function Logo({
  size = "md",
  showText = true,
}: {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}) {
  const dims = size === "lg" ? 48 : size === "sm" ? 28 : 36;
  const text =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-xl";

  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <Image
        src="/myicon.png"
        alt="CalculioHub"
        width={dims}
        height={dims}
        className="h-auto w-auto shrink-0 object-contain transition group-hover:scale-105"
        style={{ width: dims, height: dims }}
        priority
        unoptimized
      />
      {showText && (
        <span
          className={`font-[family-name:var(--font-display)] font-bold tracking-tight text-[var(--foreground)] ${text}`}
        >
          Calculio<span className="gradient-text">Hub</span>
        </span>
      )}
    </Link>
  );
}
