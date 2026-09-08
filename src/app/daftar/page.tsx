import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { registerAction } from "@/app/auth-actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ConfigurationMissing } from "@/components/ui";

export const metadata: Metadata = { title: "Daftar", description: "Mulai gunakan UMKM Insight untuk memahami bisnis Anda." };

export default function RegisterPage() {
  if (!isSupabaseConfigured()) return <main className="grid min-h-dvh place-items-center"><ConfigurationMissing /></main>;
  return (
    <AuthShell eyebrow="Mulai tanpa biaya" title="Buat akun UMKM Insight" description="Siapkan dashboard bisnis Anda dalam beberapa menit." footer={<>Sudah punya akun? <Link href="/masuk" className="font-bold text-indigo-600 hover:underline dark:text-indigo-400">Masuk</Link></>}>
      <AuthForm mode="register" action={registerAction} />
    </AuthShell>
  );
}
