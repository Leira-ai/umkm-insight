import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ArrowRight, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const primaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:ring-offset-slate-950";
export const secondaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({ icon: Icon = AlertTriangle, title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-14 text-center">
      <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
        <Icon className="size-7" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className={cn(primaryButton, "mt-6")}>
          {actionLabel}<ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

export function ConfigurationMissing() {
  return (
    <EmptyState
      icon={Settings2}
      title="Supabase belum terhubung"
      description="Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY pada environment deployment. Kunci service role tidak diperlukan dan tidak boleh digunakan di browser."
      actionHref="/demo"
      actionLabel="Jelajahi mode demo"
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800", className)} />;
}
