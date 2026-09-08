import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { loginAction } from "@/app/auth-actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ConfigurationMissing } from "@/components/ui";
import { safeNextPath } from "@/lib/utils";

export const metadata: Metadata = { title: "Masuk", description: "Masuk ke dashboard UMKM Insight." };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const query = await searchParams;
  if (!isSupabaseConfigured()) return <main className="grid min-h-dvh place-items-center"><ConfigurationMissing /></main>;
  return (
    <AuthShell eyebrow="Selamat datang kembali" title="Masuk ke akun Anda" description="Lanjutkan memantau bisnis dan temukan peluang baru dari data Anda." footer={<>Belum punya akun? <Link href="/daftar" className="font-bold text-indigo-600 hover:underline dark:text-indigo-400">Daftar gratis</Link></>}>
      {query.error && <p role="alert" className="mt-5 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">Tautan autentikasi tidak valid atau sudah kedaluwarsa. Silakan coba lagi.</p>}
      <AuthForm mode="login" action={loginAction} nextPath={safeNextPath(query.next ?? null)} />
    </AuthShell>
  );
}
