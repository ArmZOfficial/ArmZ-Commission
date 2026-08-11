import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const ok = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!ok) redirect("/admin/login");
  return <AdminShell />;
}
