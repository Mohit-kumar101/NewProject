import Link from "next/link";

export function ToolBreadcrumbs({
  toolTitle,
  category,
}: {
  toolTitle: string;
  category?: string;
}) {
  const categoryHref =
    category === "Crypto & Digital Assets"
      ? "/crypto"
      : category
        ? `/tools#${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
        : "/tools";

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 text-xs text-[var(--muted)] sm:mb-6 sm:text-sm"
    >
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 sm:gap-x-2">
        <li>
          <Link href="/" className="transition hover:text-[var(--accent)]">
            Home
          </Link>
        </li>
        <li aria-hidden className="text-[var(--border)]">
          /
        </li>
        <li>
          <Link href="/tools" className="transition hover:text-[var(--accent)]">
            Tools
          </Link>
        </li>
        {category ? (
          <>
            <li aria-hidden className="text-[var(--border)]">
              /
            </li>
            <li className="max-w-[9rem] truncate sm:max-w-[14rem] md:max-w-none">
              <Link
                href={categoryHref}
                className="transition hover:text-[var(--accent)]"
                title={category}
              >
                {category}
              </Link>
            </li>
          </>
        ) : null}
        <li aria-hidden className="text-[var(--border)]">
          /
        </li>
        <li
          className="max-w-full font-medium text-[var(--foreground)] break-words-safe md:max-w-none"
          aria-current="page"
          title={toolTitle}
        >
          {toolTitle}
        </li>
      </ol>
    </nav>
  );
}
