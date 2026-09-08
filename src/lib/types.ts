export type TransactionType = "Penjualan" | "Pembelian";
export type TransactionStatus = "Selesai" | "Diproses" | "Dibatalkan";

export interface Product {
  sku: string;
  name: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  reorderPoint: number;
  unit: string;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  sku: string;
  productName: string;
  category: string;
  type: TransactionType;
  quantity: number;
  unitPrice: number;
  total: number;
  channel: "Toko" | "WhatsApp" | "Marketplace";
  status: TransactionStatus;
}

export interface DashboardFilters {
  period: 7 | 30 | 90;
  category: string;
}

export interface DailyMetric {
  date: string;
  label: string;
  omzet: number;
  laba: number;
}

export interface CategoryMetric {
  name: string;
  value: number;
  color: string;
}
