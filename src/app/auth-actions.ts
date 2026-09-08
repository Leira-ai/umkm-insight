"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/utils";

export interface AuthState {
  message?: string;
  success?: string;
  fields?: { email?: string; name?: string };
}

const emailSchema = z.string().trim().email("Masukkan alamat email yang valid.");
const passwordSchema = z.string().min(8, "Kata sandi minimal 8 karakter.");

function messageFromError(error: { message: string }): string {
  const value = error.message.toLowerCase();
  if (value.includes("invalid login")) return "Email atau kata sandi tidak cocok.";
  if (value.includes("already registered")) return "Email ini sudah terdaftar. Silakan masuk.";
  if (value.includes("rate limit")) return "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.";
  return "Permintaan belum berhasil. Periksa data Anda dan coba lagi.";
}

export async function loginAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const parsed = z.object({ email: emailSchema, password: passwordSchema }).safeParse({ email, password });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message, fields: { email } };
  const supabase = await createClient();
  if (!supabase) return { message: "Layanan masuk belum dikonfigurasi.", fields: { email } };
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { message: messageFromError(error), fields: { email } };
  redirect(safeNextPath(String(formData.get("next") ?? "")));
}

export async function registerAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const accepted = formData.get("terms") === "on";
  const parsed = z.object({ name: z.string().min(2, "Nama minimal 2 karakter."), email: emailSchema, password: passwordSchema, accepted: z.literal(true, { error: "Setujui ketentuan penggunaan untuk melanjutkan." }) }).safeParse({ name, email, password, accepted });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message, fields: { name, email } };
  const supabase = await createClient();
  if (!supabase) return { message: "Layanan pendaftaran belum dikonfigurasi.", fields: { name, email } };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.name },
      emailRedirectTo: siteUrl ? `${siteUrl.replace(/\/$/, "")}/auth/callback?next=/app` : undefined,
    },
  });
  if (error) return { message: messageFromError(error), fields: { name, email } };
  return { success: "Akun dibuat. Periksa email Anda untuk mengonfirmasi akun.", fields: { name, email } };
}

export async function resetPasswordAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { message: parsed.error.issues[0]?.message, fields: { email } };
  const supabase = await createClient();
  if (!supabase) return { message: "Layanan pemulihan belum dikonfigurasi.", fields: { email } };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: siteUrl ? `${siteUrl.replace(/\/$/, "")}/auth/callback?next=/app` : undefined,
  });
  if (error) return { message: messageFromError(error), fields: { email } };
  return { success: "Tautan pemulihan sudah dikirim. Periksa kotak masuk dan folder spam Anda.", fields: { email } };
}

export async function logoutAction() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/masuk");
}
