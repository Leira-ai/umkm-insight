"use client";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { primaryButton } from "@/components/ui";
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error(error); }, [error]); return <div className="mx-auto max-w-lg py-20 text-center"><AlertTriangle className="mx-auto size-10 text-rose-500"/><h1 className="mt-5 text-2xl font-black">Data belum dapat ditampilkan</h1><p className="mt-2 text-sm text-slate-500">Coba lagi. Jika masalah berlanjut, periksa koneksi Anda.</p><button onClick={reset} className={`${primaryButton} mt-6`}><RotateCcw className="size-4"/> Coba lagi</button></div>; }
