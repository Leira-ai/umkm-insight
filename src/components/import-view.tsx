"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, LockKeyhole, UploadCloud, X } from "lucide-react";
import Papa from "papaparse";
import { z } from "zod";
import { primaryButton, secondaryButton } from "./ui";

const schema = z.object({ tanggal: z.string().min(1), sku: z.string().min(1), nama_produk: z.string().min(1), kategori: z.string().min(1), jenis: z.enum(["Penjualan", "Pembelian"]), jumlah: z.coerce.number().int().positive(), harga_satuan: z.coerce.number().positive(), kanal: z.enum(["Toko", "WhatsApp", "Marketplace"]) });
type PreviewRow = z.infer<typeof schema> & { _valid: boolean; _error?: string };
const headers = ["tanggal", "sku", "nama_produk", "kategori", "jenis", "jumlah", "harga_satuan", "kanal"];
const sample = [headers, ["2026-09-08 09:30", "KOPI-001", "Kopi Susu Aren", "Minuman", "Penjualan", "2", "22000", "WhatsApp"], ["2026-09-08 11:00", "SNACK-001", "Keripik Pisang Cokelat", "Camilan", "Penjualan", "1", "24000", "Toko"]];

export function ImportView({ demo = false }: { demo?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [fileError, setFileError] = useState("");
  const validRows = rows.filter((row) => row._valid).length;

  function downloadTemplate() {
    const csv = `\uFEFF${Papa.unparse(sample)}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "template-transaksi-umkm-insight.csv"; link.click(); URL.revokeObjectURL(url);
  }
  function readFile(file?: File) {
    if (!file) return;
    setFileError(""); setFileName(file.name);
    if (file.size > 5 * 1024 * 1024) { setFileError("Ukuran file maksimal 5 MB."); setRows([]); return; }
    Papa.parse<Record<string, string>>(file, { header: true, skipEmptyLines: true, transformHeader: (header) => header.trim().toLowerCase(), complete(result) {
      if (result.errors.length) { setFileError(`CSV tidak dapat dibaca: ${result.errors[0]?.message}`); setRows([]); return; }
      const missing = headers.filter((header) => !result.meta.fields?.includes(header));
      if (missing.length) { setFileError(`Kolom wajib belum ada: ${missing.join(", ")}.`); setRows([]); return; }
      setRows(result.data.slice(0, 100).map((raw) => { const parsed = schema.safeParse(raw); return parsed.success ? { ...parsed.data, _valid: true } : { ...(raw as unknown as z.infer<typeof schema>), _valid: false, _error: parsed.error.issues[0]?.message }; }));
    }});
  }

  return <div className="mx-auto max-w-5xl"><div><div className="flex items-center gap-2"><h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Impor data transaksi</h1>{demo && <span className="badge bg-amber-100 text-amber-700">Baca-saja</span>}</div><p className="mt-1 text-sm text-slate-500">Unggah CSV, periksa format, lalu simpan transaksi Anda.</p></div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[.75fr_1.25fr]"><section className="card p-5"><div className="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300"><FileSpreadsheet className="size-5" /></div><h2 className="mt-4 font-extrabold text-slate-950 dark:text-white">1. Gunakan template</h2><p className="mt-2 text-xs leading-5 text-slate-500">Template memakai pemisah koma, encoding UTF-8 dengan BOM, dan delapan kolom wajib.</p><button onClick={downloadTemplate} className={`${secondaryButton} mt-5 w-full`}><Download className="size-4" /> Unduh template CSV</button><div className="mt-5 rounded-xl bg-slate-50 p-4 text-[11px] leading-5 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300"><strong className="block text-slate-900 dark:text-white">Format yang diterima</strong><span>tanggal: YYYY-MM-DD HH:mm</span><br/><span>jenis: Penjualan / Pembelian</span><br/><span>kanal: Toko / WhatsApp / Marketplace</span></div></section>
    <section className="card p-5"><h2 className="font-extrabold text-slate-950 dark:text-white">2. Unggah dan periksa</h2><p className="mt-1 text-xs text-slate-500">Maksimal 5 MB. Data belum dikirim saat tahap ini.</p><input ref={inputRef} type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => readFile(event.target.files?.[0])} /><button type="button" onClick={() => inputRef.current?.click()} onDrop={(event) => { event.preventDefault(); readFile(event.dataTransfer.files[0]); }} onDragOver={(event) => event.preventDefault()} className="mt-5 flex min-h-44 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-indigo-500"><UploadCloud className="size-8 text-indigo-500" /><span className="mt-3 text-sm font-extrabold text-slate-800 dark:text-white">Tarik CSV ke sini atau pilih file</span><span className="mt-1 text-xs text-slate-500">Hanya file .csv</span></button>{fileError && <p role="alert" className="mt-3 flex gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"><AlertCircle className="size-4 shrink-0" />{fileError}</p>}{fileName && !fileError && <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800"><CheckCircle2 className="size-5 text-emerald-500"/><div className="min-w-0 flex-1"><p className="truncate text-xs font-extrabold">{fileName}</p><p className="text-[10px] text-slate-500">{validRows} valid · {rows.length - validRows} perlu diperbaiki</p></div><button onClick={() => { setRows([]); setFileName(""); }} aria-label="Hapus file"><X className="size-4 text-slate-400"/></button></div>}</section></div>
    {rows.length > 0 && <section className="card mt-5 overflow-hidden"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"><div><h2 className="font-extrabold text-slate-950 dark:text-white">Pratinjau data</h2><p className="mt-1 text-xs text-slate-500">Menampilkan maksimal 100 baris pertama.</p></div><button disabled={demo || validRows !== rows.length} className={primaryButton}>{demo && <LockKeyhole className="size-4" />}{demo ? "Impor dinonaktifkan di demo" : `Impor ${validRows} transaksi`}</button></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Status</th><th>Tanggal</th><th>SKU</th><th>Produk</th><th>Jenis</th><th>Jumlah</th><th>Harga</th></tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.sku}-${index}`}><td>{row._valid ? <span className="badge bg-emerald-50 text-emerald-700">Valid</span> : <span title={row._error} className="badge bg-rose-50 text-rose-700">Periksa</span>}</td><td>{row.tanggal}</td><td>{row.sku}</td><td>{row.nama_produk}</td><td>{row.jenis}</td><td>{row.jumlah}</td><td>{row.harga_satuan}</td></tr>)}</tbody></table></div></section>}
  </div>;
}
