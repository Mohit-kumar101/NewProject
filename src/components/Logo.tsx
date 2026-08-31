import Image from "next/image";
import Link from "next/link";

export function Logo({
  size = "md",
  showText = true,
  priority = false,
}: {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  /** Set true only for the LCP logo in the header/hero. */
  priority?: boolean;
}) {
  const dims = size === "lg" ? 48 : size === "sm" ? 28 : 36;
  const text =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-xl";

  return (
    <Link
      href="/"
      className="group inline-flex max-w-full items-center gap-2 sm:gap-2.5"
    >
      <Image
        src="/favicon-192.png"
        alt="CalculioHub"
        width={dims}
        height={dims}
        className="shrink-0 rounded-lg object-contain transition group-hover:scale-105"
        style={{ width: dims, height: dims }}
        sizes={`${dims}px`}
        priority={priority}
      />
      {showText && (
        <span
          className={`font-[family-name:var(--font-display)] truncate font-bold tracking-tight text-[var(--foreground)] ${text}`}
        >
          Calculio<span className="gradient-text">Hub</span>
        </span>
      )}
    </Link>
  );
}
