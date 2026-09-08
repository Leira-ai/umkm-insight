import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ConfigurationMissing } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s | UMKM Insight" }, robots: { index: false, follow: false } };

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  if (!isSupabaseConfigured()) return <main className="grid min-h-dvh place-items-center"><ConfigurationMissing /></main>;
  const supabase = await createClient();
  const { data } = await supabase!.auth.getUser();
  if (!data.user) redirect("/masuk");
  const name = String(data.user.user_metadata.full_name ?? data.user.email?.split("@")[0] ?? "Pemilik Usaha");
  return <AppShell userName={name} userEmail={data.user.email ?? ""}>{children}</AppShell>;
}
