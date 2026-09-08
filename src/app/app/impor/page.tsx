import type { Metadata } from "next";
import { ImportView } from "@/components/import-view";
export const metadata: Metadata = { title: "Impor data" };
export default function ImportPage() { return <ImportView />; }
