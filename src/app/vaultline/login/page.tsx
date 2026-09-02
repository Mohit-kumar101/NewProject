import { Suspense } from "react";
import { AuthForm } from "@/components/vaultline/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-6xl px-3 py-10 sm:px-6 sm:py-14">
      <Suspense fallback={<p className="text-center text-sm text-[var(--muted)]">Loading…</p>}>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
