import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart3, CheckCircle2, Sparkles } from "lucide-react";
import { Brand } from "./brand";
import { ThemeToggle } from "./theme-toggle";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(99,102,241,.3),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,.16),transparent_35%)]" />
        <div className="relative"><Brand inverse /></div>
        <div className="relative max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-bold text-indigo-200"><Sparkles className="size-3.5" /> Dibuat untuk pemilik usaha</div>
          <blockquote className="text-4xl font-extrabold leading-tight tracking-tight">“Sekarang saya tahu produk mana yang benar-benar menghasilkan laba.”</blockquote>
          <p className="mt-5 text-base leading-7 text-slate-300">Semua angka penting bisnis tersaji rapi, tanpa spreadsheet yang rumit.</p>
          <div className="mt-8 flex flex-wrap gap-5 text-sm font-semibold text-slate-300"><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-400" /> Mudah dipahami</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-400" /> Data tetap milik Anda</span></div>
        </div>
        <div className="relative flex items-center gap-3 text-xs text-slate-500"><BarChart3 className="size-4" /> Analitik sederhana, keputusan lebih mantap.</div>
      </section>
      <section className="flex min-w-0 flex-col bg-white dark:bg-slate-950">
        <div className="flex h-16 items-center justify-between px-5 lg:hidden"><Brand /><ThemeToggle /></div>
        <div className="hidden justify-end p-5 lg:flex"><ThemeToggle /></div>
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-indigo-600 dark:text-indigo-400">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
            {children}
            <div className="mt-7 text-center text-sm text-slate-600 dark:text-slate-400">{footer}</div>
            <p className="mt-8 text-center text-xs text-slate-400"><Link href="/" className="hover:text-indigo-600">Kembali ke beranda</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
