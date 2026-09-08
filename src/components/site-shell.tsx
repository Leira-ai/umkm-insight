import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { Brand } from "./brand";
import { ThemeToggle } from "./theme-toggle";
import { primaryButton } from "./ui";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <Brand />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi utama">
          <Link href="/#fitur" className="nav-link">Fitur</Link>
          <Link href="/#cara-kerja" className="nav-link">Cara kerja</Link>
          <Link href="/#tentang" className="nav-link">Tentang</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/masuk" className="hidden px-3 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 dark:text-slate-200 sm:block">Masuk</Link>
          <Link href="/demo" className={`${primaryButton} hidden sm:inline-flex`}>
            Coba demo <ArrowRight className="size-4" />
          </Link>
          <details className="relative sm:hidden">
            <summary className="icon-button list-none"><Menu className="size-5" /><span className="sr-only">Buka menu</span></summary>
            <div className="absolute right-0 top-12 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <Link href="/#fitur" className="mobile-menu-link">Fitur</Link>
              <Link href="/#cara-kerja" className="mobile-menu-link">Cara kerja</Link>
              <Link href="/masuk" className="mobile-menu-link">Masuk</Link>
              <Link href="/demo" className="mobile-menu-link text-indigo-600 dark:text-indigo-400">Coba demo</Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="page-container flex flex-col gap-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <Brand />
        <p>© {new Date().getFullYear()} UMKM Insight. Dibuat untuk bisnis Indonesia.</p>
        <div className="flex gap-5"><Link href="/demo" className="hover:text-indigo-600">Demo</Link><Link href="/masuk" className="hover:text-indigo-600">Masuk</Link></div>
      </div>
    </footer>
  );
}
