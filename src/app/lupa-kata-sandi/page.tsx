import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { resetPasswordAction } from "@/app/auth-actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ConfigurationMissing } from "@/components/ui";

export const metadata: Metadata = { title: "Lupa kata sandi", description: "Pulihkan akses ke akun UMKM Insight." };

export default function ResetPage() {
  if (!isSupabaseConfigured()) return <main className="grid min-h-dvh place-items-center"><ConfigurationMissing /></main>;
  return (
    <AuthShell eyebrow="Pulihkan akses" title="Lupa kata sandi?" description="Masukkan email terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi." footer="Pastikan Anda juga memeriksa folder spam.">
      <AuthForm mode="reset" action={resetPasswordAction} />
    </AuthShell>
  );
}
