import Link from "next/link";
import { SearchX } from "lucide-react";
import { Brand } from "@/components/brand";
import { primaryButton } from "@/components/ui";

export default function NotFound() { return <main className="grid min-h-dvh place-items-center bg-slate-50 px-5 dark:bg-slate-950"><div className="max-w-md text-center"><Brand /><div className="mx-auto mt-10 grid size-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"><SearchX className="size-8" /></div><p className="mt-6 text-xs font-black uppercase tracking-[.2em] text-indigo-600">404</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Halaman tidak ditemukan</h1><p className="mt-3 text-sm leading-6 text-slate-500">Tautan mungkin sudah berubah atau alamat yang Anda masukkan kurang tepat.</p><Link href="/" className={`${primaryButton} mt-7`}>Kembali ke beranda</Link></div></main>; }
