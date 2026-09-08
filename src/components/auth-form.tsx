"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import type { AuthState } from "@/app/auth-actions";
import { primaryButton } from "./ui";

interface AuthFormProps {
  mode: "login" | "register" | "reset";
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  nextPath?: string;
}

const initialState: AuthState = {};

export function AuthForm({ mode, action, nextPath }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === "login";
  const isRegister = mode === "register";

  return (
    <form action={formAction} className="mt-7 space-y-4">
      {nextPath && <input type="hidden" name="next" value={nextPath} />}
      {isRegister && (
        <div><label htmlFor="name" className="label">Nama lengkap</label><div className="relative"><UserRound className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400" /><input id="name" name="name" autoComplete="name" defaultValue={state.fields?.name} className="input pl-10" placeholder="Nama Anda" required /></div></div>
      )}
      <div><label htmlFor="email" className="label">Email</label><div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400" /><input id="email" name="email" type="email" autoComplete="email" inputMode="email" defaultValue={state.fields?.email} className="input pl-10" placeholder="nama@email.com" required /></div></div>
      {mode !== "reset" && (
        <div>
          <div className="flex items-center justify-between"><label htmlFor="password" className="label">Kata sandi</label>{isLogin && <Link href="/lupa-kata-sandi" className="mb-1.5 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400">Lupa kata sandi?</Link>}</div>
          <div className="relative"><LockKeyhole className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400" /><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete={isLogin ? "current-password" : "new-password"} className="input px-10" placeholder="Minimal 8 karakter" minLength={8} required /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1 grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>
        </div>
      )}
      {isRegister && <label className="flex items-start gap-2.5 text-xs leading-5 text-slate-600 dark:text-slate-400"><input name="terms" type="checkbox" className="mt-1 size-4 rounded border-slate-300 accent-indigo-600" required /><span>Saya menyetujui ketentuan penggunaan dan kebijakan privasi UMKM Insight.</span></label>}
      {state.message && <div role="alert" className="flex gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold leading-5 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"><AlertCircle className="mt-0.5 size-4 shrink-0" />{state.message}</div>}
      {state.success && <div role="status" className="flex gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold leading-5 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><CheckCircle2 className="mt-0.5 size-4 shrink-0" />{state.success}</div>}
      <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>{pending ? "Memproses…" : isLogin ? "Masuk ke dashboard" : isRegister ? "Buat akun gratis" : "Kirim tautan pemulihan"}</button>
      {mode === "reset" && <Link href="/masuk" className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-300"><ArrowLeft className="size-4" /> Kembali ke halaman masuk</Link>}
    </form>
  );
}
