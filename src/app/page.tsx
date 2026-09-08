import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, FileSpreadsheet, PackageSearch, ShieldCheck, Sparkles, TrendingUp, Upload } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { primaryButton, secondaryButton } from "@/components/ui";

export const metadata: Metadata = { title: "UMKM Insight — Data sederhana, keputusan lebih mantap", description: "Pahami omzet, laba, dan produk terlaris bisnis Anda tanpa rumus yang rumit." };

const features = [
  { icon: TrendingUp, title: "Pantau kinerja", text: "Lihat omzet, laba, dan rata-rata transaksi dalam satu tampilan yang mudah dibaca.", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300" },
  { icon: PackageSearch, title: "Kenali produk terbaik", text: "Temukan produk paling laris, paling menguntungkan, dan stok yang perlu segera diisi.", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300" },
  { icon: FileSpreadsheet, title: "Impor tanpa repot", text: "Gunakan template CSV sederhana. Kami membantu memeriksa data sebelum diproses.", color: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300" },
];

export default function Home() {
  return (
    <div className="min-h-dvh bg-white dark:bg-slate-950">
      <a href="#konten" className="skip-link">Lewati ke konten</a>
      <SiteHeader />
      <main id="konten">
        <section className="relative overflow-hidden border-b border-slate-100 bg-[linear-gradient(180deg,#fff_0%,#f8faff_100%)] py-16 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,#020617_58%)] sm:py-24">
          <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-700/15" />
          <div className="page-container relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300"><Sparkles className="size-3.5" /> Wawasan bisnis, tanpa rumus rumit</div>
              <h1 className="text-4xl font-black leading-[1.08] tracking-[-.04em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">Data sederhana.<br /><span className="text-indigo-600 dark:text-indigo-400">Keputusan lebih mantap.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">UMKM Insight mengubah catatan transaksi Anda menjadi ringkasan yang jelas—agar Anda tahu apa yang laris, apa yang untung, dan apa langkah berikutnya.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/demo" className={primaryButton}>Lihat demo interaktif <ArrowRight className="size-4" /></Link><Link href="/daftar" className={secondaryButton}>Mulai gratis</Link></div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400"><span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-500" /> Tanpa kartu kredit</span><span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-emerald-500" /> Data tetap milik Anda</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-xl">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-indigo-950/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
                  <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ringkasan bulan ini</p><p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">Toko Rasa Kita</p></div><div className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white"><BarChart3 className="size-5" /></div></div>
                  <div className="mt-5 grid grid-cols-2 gap-3"><PreviewCard label="Omzet" value="Rp18,6 jt" change="+12,4%" /><PreviewCard label="Laba kotor" value="Rp8,2 jt" change="+9,8%" /></div>
                  <div className="mt-3 rounded-xl bg-white p-4 dark:bg-slate-900"><div className="flex h-32 items-end gap-2" aria-label="Pratinjau grafik omzet">{[38, 58, 46, 70, 52, 82, 68, 94, 72, 105, 90, 120].map((height, index) => <span key={height + index} className="flex-1 rounded-t bg-indigo-500/80" style={{ height }} />)}</div><div className="mt-3 flex justify-between text-[9px] font-semibold text-slate-400"><span>1 Agu</span><span>15 Agu</span><span>31 Agu</span></div></div>
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30"><div className="grid size-9 place-items-center rounded-lg bg-emerald-500 text-white"><TrendingUp className="size-4" /></div><div><p className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">Kopi Susu Aren sedang naik</p><p className="mt-0.5 text-[10px] text-emerald-700 dark:text-emerald-400">Penjualan naik 24% dari periode sebelumnya.</p></div></div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:flex sm:items-center sm:gap-3"><div className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950"><Upload className="size-5" /></div><div><p className="text-xs font-extrabold">Impor selesai</p><p className="text-[10px] text-slate-500">126 transaksi siap dianalisis</p></div></div>
            </div>
          </div>
        </section>
        <section id="fitur" className="py-20 sm:py-24"><div className="page-container"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-indigo-600 dark:text-indigo-400">Yang penting, terlihat jelas</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">Lebih sedikit menebak. Lebih yakin melangkah.</h2><p className="mt-4 text-slate-600 dark:text-slate-400">Fokus pada angka yang benar-benar membantu bisnis Anda bergerak.</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, text, color }) => <article key={title} className="card p-6"><div className={`grid size-11 place-items-center rounded-xl ${color}`}><Icon className="size-5" /></div><h3 className="mt-5 text-lg font-extrabold text-slate-950 dark:text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p></article>)}</div></div></section>
        <section id="cara-kerja" className="border-y border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/40"><div className="page-container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-indigo-600 dark:text-indigo-400">Tiga langkah sederhana</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Dari catatan transaksi ke wawasan bisnis.</h2><p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">Tak perlu mengubah cara kerja Anda secara drastis. Mulai dari data yang sudah dimiliki.</p><Link href="/demo" className={`${primaryButton} mt-6`}>Coba dengan data contoh <ArrowRight className="size-4" /></Link></div><ol className="grid gap-4 sm:grid-cols-3">{[["01", "Unduh template", "Gunakan format CSV yang sudah kami siapkan."], ["02", "Unggah data", "Periksa hasil baca sebelum data diproses."], ["03", "Baca wawasan", "Gunakan filter untuk menjawab pertanyaan bisnis."]].map(([number, title, text]) => <li key={number} className="card p-5"><span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{number}</span><h3 className="mt-8 font-extrabold text-slate-950 dark:text-white">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</p></li>)}</ol></div></section>
        <section id="tentang" className="py-20"><div className="page-container"><div className="overflow-hidden rounded-3xl bg-indigo-600 px-6 py-12 text-center text-white shadow-xl shadow-indigo-500/20 sm:px-12"><h2 className="text-3xl font-black tracking-tight sm:text-4xl">Siap memahami bisnis Anda lebih baik?</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-indigo-100">Coba dashboard dengan data contoh. Tidak perlu daftar, tidak ada data yang disimpan.</p><Link href="/demo" className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-indigo-700 transition hover:bg-indigo-50">Buka demo sekarang <ArrowRight className="size-4" /></Link></div></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}

function PreviewCard({ label, value, change }: { label: string; value: string; change: string }) {
  return <div className="rounded-xl bg-white p-3 dark:bg-slate-900"><p className="text-[10px] font-bold text-slate-400">{label}</p><p className="mt-1 text-lg font-black text-slate-900 dark:text-white">{value}</p><p className="mt-1 text-[10px] font-bold text-emerald-600">{change}</p></div>;
}
