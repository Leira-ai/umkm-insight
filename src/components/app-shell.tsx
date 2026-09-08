"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BarChart3, FileUp, LayoutDashboard, LogOut, Menu, ReceiptText, X } from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/app/auth-actions";
import { Brand } from "./brand";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

const links = [
  { href: "/app", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/app/transaksi", label: "Transaksi", icon: ReceiptText },
  { href: "/app/impor", label: "Impor data", icon: FileUp },
];

interface AppShellProps {
  children: ReactNode;
  userName: string;
  userEmail: string;
}

export function AppShell({ children, userName, userEmail }: AppShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <a href="#main-content" className="skip-link">Lewati ke konten</a>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-18 items-center px-5"><Brand href="/app" /></div>
        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Navigasi aplikasi">
          {links.map((link) => <NavItem key={link.href} {...link} active={link.href === "/app" ? pathname === link.href : pathname.startsWith(link.href)} />)}
        </nav>
        <UserPanel userName={userName} userEmail={userEmail} />
      </aside>
      {open && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Tutup menu" /><aside className="relative flex h-full w-[min(82vw,19rem)] flex-col bg-white shadow-2xl dark:bg-slate-900"><div className="flex h-16 items-center justify-between px-4"><Brand href="/app" /><button className="icon-button" onClick={() => setOpen(false)} aria-label="Tutup navigasi"><X className="size-5" /></button></div><nav className="flex-1 space-y-1 px-3 py-4">{links.map((link) => <div key={link.href} onClick={() => setOpen(false)}><NavItem {...link} active={link.href === "/app" ? pathname === link.href : pathname.startsWith(link.href)} /></div>)}</nav><UserPanel userName={userName} userEmail={userEmail} /></aside></div>}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur lg:px-7 dark:border-slate-800 dark:bg-slate-950/90"><button className="icon-button lg:hidden" onClick={() => setOpen(true)} aria-label="Buka navigasi"><Menu className="size-5" /></button><div className="hidden items-center gap-2 text-xs font-bold text-slate-400 lg:flex"><BarChart3 className="size-4" /> Data diperbarui otomatis</div><div className="ml-auto flex items-center gap-2"><ThemeToggle /><div className="ml-1 grid size-9 place-items-center rounded-xl bg-indigo-100 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{initials(userName)}</div></div></header>
        <main id="main-content" className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ href, label, icon: Icon, active }: { href: string; label: string; icon: typeof LayoutDashboard; active: boolean }) {
  return <Link href={href} aria-current={active ? "page" : undefined} className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition", active ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white")}><Icon className="size-[18px]" />{label}</Link>;
}

function UserPanel({ userName, userEmail }: { userName: string; userEmail: string }) {
  return <div className="border-t border-slate-200 p-3 dark:border-slate-800"><div className="mb-2 flex min-w-0 items-center gap-3 rounded-xl p-2"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-100 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{initials(userName)}</div><div className="min-w-0"><p className="truncate text-xs font-extrabold text-slate-900 dark:text-white">{userName}</p><p className="truncate text-[10px] text-slate-500">{userEmail}</p></div></div><form action={logoutAction}><button type="submit" className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-xs font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"><LogOut className="size-4" /> Keluar</button></form></div>;
}
