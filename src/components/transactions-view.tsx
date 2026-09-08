"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { categories, transactions } from "@/lib/demo-data";
import { formatCurrency, formatDate } from "@/lib/format";
import type { TransactionStatus, TransactionType } from "@/lib/types";

export function TransactionsView({ demo = false, compact = false }: { demo?: boolean; compact?: boolean }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua kategori");
  const [type, setType] = useState<"Semua" | TransactionType>("Semua");
  const filtered = useMemo(() => transactions.filter((item) => {
    const term = search.toLocaleLowerCase("id-ID");
    return (!term || item.productName.toLocaleLowerCase("id-ID").includes(term) || item.id.toLocaleLowerCase("id-ID").includes(term) || item.sku.toLocaleLowerCase("id-ID").includes(term)) &&
      (category === "Semua kategori" || item.category === category) && (type === "Semua" || item.type === type);
  }), [search, category, type]);

  return (
    <section id="transaksi" className={compact ? "mt-8" : "mx-auto max-w-[1400px]"}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2"><h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Transaksi</h1>{demo && <span className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Data contoh</span>}</div><p className="mt-1 text-sm text-slate-500">Cari dan saring seluruh aktivitas bisnis.</p></div><p className="text-xs font-bold text-slate-500">{filtered.length} dari {transactions.length} transaksi</p></div>
      <div className="card mt-5 p-3 sm:p-4"><div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_180px_160px]"><label className="relative"><span className="sr-only">Cari transaksi</span><Search className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="input pl-10" placeholder="Cari nama, SKU, atau ID…" /></label><select value={category} onChange={(event) => setCategory(event.target.value)} className="input" aria-label="Filter kategori">{categories.map((item) => <option key={item}>{item}</option>)}</select><select value={type} onChange={(event) => setType(event.target.value as typeof type)} className="input" aria-label="Filter jenis transaksi"><option>Semua</option><option>Penjualan</option><option>Pembelian</option></select></div></div>
      <div className="desktop-table card mt-4 overflow-hidden"><div className="table-wrap"><table className="data-table"><thead><tr><th>Transaksi</th><th>Produk</th><th>Jenis</th><th>Kanal</th><th>Status</th><th className="text-right">Total</th></tr></thead><tbody>{filtered.slice(0, 60).map((item) => <tr key={item.id} data-testid="transaction-row"><td><p className="font-bold text-slate-900 dark:text-white">{item.id}</p><p className="mt-1 text-[10px] text-slate-500">{formatDate(item.date, true)}</p></td><td><Link href={demo ? `/demo?produk=${item.sku}#transaksi` : `/app/produk/${item.sku}`} className="font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">{item.productName}</Link><p className="mt-1 text-[10px] text-slate-500">{item.sku} · {item.quantity} item</p></td><td>{item.type}</td><td>{item.channel}</td><td><StatusBadge status={item.status} /></td><td className="text-right font-extrabold text-slate-900 dark:text-white">{formatCurrency(item.total)}</td></tr>)}</tbody></table></div></div>
      <div className="mobile-card-list mt-4 gap-3">{filtered.slice(0, 40).map((item) => <article key={item.id} data-testid="transaction-row" className="card p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[10px] font-bold text-slate-400">{item.id}</p><Link href={demo ? `/demo?produk=${item.sku}#transaksi` : `/app/produk/${item.sku}`} className="mt-1 block truncate text-sm font-extrabold text-slate-900 dark:text-white">{item.productName}</Link><p className="mt-1 text-[10px] text-slate-500">{formatDate(item.date, true)}</p></div><StatusBadge status={item.status} /></div><div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3 dark:border-slate-800"><div className="text-[10px] text-slate-500"><p>{item.type} · {item.channel}</p><p className="mt-1">{item.quantity} × {formatCurrency(item.unitPrice)}</p></div><p className="text-sm font-black text-slate-950 dark:text-white">{formatCurrency(item.total)}</p></div></article>)}</div>
      {!filtered.length && <div className="mt-4 rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700"><SlidersHorizontal className="mx-auto size-7 text-slate-400" /><p className="mt-3 font-extrabold">Tidak ada transaksi yang cocok</p><p className="mt-1 text-sm text-slate-500">Ubah kata kunci atau filter Anda.</p></div>}
    </section>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const tones = { Selesai: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300", Diproses: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300", Dibatalkan: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300" };
  return <span className={`badge ${tones[status]}`}><i className="size-1.5 rounded-full bg-current" />{status}</span>;
}
