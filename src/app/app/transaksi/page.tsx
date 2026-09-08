import type { Metadata } from "next";
import { TransactionsView } from "@/components/transactions-view";
export const metadata: Metadata = { title: "Transaksi" };
export default function TransactionsPage() { return <TransactionsView />; }
