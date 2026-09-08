import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandProps {
  href?: string;
  compact?: boolean;
  inverse?: boolean;
}

export function Brand({ href = "/", compact = false, inverse = false }: BrandProps) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label="UMKM Insight">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 transition-transform group-hover:-rotate-3">
        <BarChart3 className="size-5" aria-hidden="true" />
      </span>
      {!compact && (
        <span className={cn("text-[17px] font-extrabold tracking-tight", inverse ? "text-white" : "text-slate-950 dark:text-white")}>
          UMKM <span className="text-indigo-600 dark:text-indigo-400">Insight</span>
        </span>
      )}
    </Link>
  );
}
