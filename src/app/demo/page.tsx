import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Dashboard } from "@/components/dashboard";
import { TransactionsView } from "@/components/transactions-view";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProductDetail } from "@/components/product-detail";
import { ImportView } from "@/components/import-view";
import { findProduct, transactions } from "@/lib/demo-data";
import { secondaryButton } from "@/components/ui";

export const metadata: Metadata = { title: "Demo interaktif", description: "Jelajahi dashboard UMKM Insight menggunakan data contoh lokal." };

export default async function DemoPage({ searchParams }: { searchParams: Promise<{ produk?: string }> }) {
  const { produk } = await searchParams;
  const selectedProduct = produk ? findProduct(produk.toUpperCase()) : undefined;
  return <div className="min-h-dvh bg-slate-50 dark:bg-slate-950"><header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90"><div className="page-container flex h-16 items-center justify-between gap-3"><Brand href="/demo" /><div className="flex items-center gap-2"><ThemeToggle /><Link href="/" className={`${secondaryButton} hidden sm:inline-flex`}><ArrowLeft className="size-4" /> Beranda</Link><Link href="/daftar" className="inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-4 text-xs font-extrabold text-white hover:bg-indigo-700">Gunakan data saya</Link></div></div></header><main className="page-container py-6 sm:py-8"><div role="note" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">Ini adalah mode demo baca-saja. Semua angka berasal dari data contoh lokal dan tidak ada perubahan yang disimpan.</div>{selectedProduct ? <ProductDetail product={selectedProduct} transactions={transactions.filter((item) => item.sku === selectedProduct.sku)} backHref="/demo#transaksi" /> : <><Dashboard demo /><TransactionsView demo compact /><div className="mt-12 border-t border-slate-200 pt-10 dark:border-slate-800"><ImportView demo /></div></>}</main></div>;
}
