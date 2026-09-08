"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { primaryButton } from "@/components/ui";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error(error); }, [error]); return <html lang="id"><body><main className="grid min-h-dvh place-items-center bg-slate-50 px-5 text-slate-950 dark:bg-slate-950 dark:text-white"><div className="max-w-md text-center"><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950"><AlertTriangle className="size-8" /></div><h1 className="mt-6 text-3xl font-black tracking-tight">Terjadi kendala</h1><p className="mt-3 text-sm leading-6 text-slate-500">Kami belum bisa menampilkan halaman ini. Coba muat kembali dalam beberapa saat.</p><button onClick={reset} className={`${primaryButton} mt-7`}><RotateCcw className="size-4"/> Coba lagi</button></div></main></body></html>; }
