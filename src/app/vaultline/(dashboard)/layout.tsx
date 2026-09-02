import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/vaultline/session";
import { VaultlineShell } from "@/components/vaultline/VaultlineShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/vaultline/login");
  return <VaultlineShell user={user}>{children}</VaultlineShell>;
}
