import Link from "next/link";

export function ToolBreadcrumbs({
  toolTitle,
  category,
}: {
  toolTitle: string;
  category?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--muted)]">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
            <li className="max-w-[12rem] truncate sm:max-w-none">
              <Link
                href={`/tools#${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="transition hover:text-[var(--accent)]"
              >
                {category}
              </Link>
            </li>
          </>
        ) : null}
        <li aria-hidden className="text-[var(--border)]">
          /
        </li>
        <li className="font-medium text-[var(--foreground)]" aria-current="page">
          {toolTitle}
        </li>
      </ol>
    </nav>
  );
}
