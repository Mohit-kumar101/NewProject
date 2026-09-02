"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Bookmark,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { VaultlineUser } from "@/lib/vaultline/types";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { href: "/vaultline", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/vaultline/saved", label: "Saved tools", icon: Bookmark },
  { href: "/vaultline/purchases", label: "Purchases", icon: Package },
  {
    href: "/vaultline/subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
  },
  { href: "/vaultline/settings", label: "Settings", icon: Settings },
];

export function VaultlineShell({
  user,
  children,
}: {
  user: VaultlineUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/vaultline/logout", { method: "POST" });
    router.push("/vaultline/login");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--accent)]">
              Vaultline
            </span>
            <span className="hidden text-xs text-[var(--muted)] sm:inline">
              Free account · your saved data
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden text-sm text-[var(--muted)] sm:inline">
              {user.name || user.email}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-8">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              Free account
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-[var(--foreground)]">
              {user.email}
            </p>

            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
              {NAV.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))] text-[var(--accent)]"
                        : "text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 hidden border-t border-[var(--border)] pt-4 lg:block">
              <Link
                href="/tools"
                className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to calculators
              </Link>
              <button
                type="button"
                onClick={logout}
                className="mt-3 flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
