import type { CategoryMetric, DailyMetric, DashboardFilters, Product, Transaction } from "./types";

export const products: Product[] = [
  { sku: "KOPI-001", name: "Kopi Susu Aren", category: "Minuman", cost: 10500, price: 22000, stock: 32, reorderPoint: 15, unit: "botol", color: "#6366f1" },
  { sku: "KOPI-002", name: "Kopi Gula Kelapa", category: "Minuman", cost: 9800, price: 20000, stock: 12, reorderPoint: 15, unit: "botol", color: "#8b5cf6" },
  { sku: "TEH-001", name: "Teh Melati Lemon", category: "Minuman", cost: 7200, price: 16000, stock: 45, reorderPoint: 12, unit: "botol", color: "#14b8a6" },
  { sku: "SNACK-001", name: "Keripik Pisang Cokelat", category: "Camilan", cost: 11000, price: 24000, stock: 8, reorderPoint: 10, unit: "pouch", color: "#f59e0b" },
  { sku: "SNACK-002", name: "Basreng Daun Jeruk", category: "Camilan", cost: 9500, price: 21000, stock: 27, reorderPoint: 10, unit: "pouch", color: "#f97316" },
  { sku: "SNACK-003", name: "Granola Kelapa", category: "Camilan", cost: 17000, price: 36000, stock: 18, reorderPoint: 8, unit: "pouch", color: "#eab308" },
  { sku: "HAMPER-001", name: "Hampers Teman Ngopi", category: "Hampers", cost: 72000, price: 135000, stock: 7, reorderPoint: 4, unit: "box", color: "#ec4899" },
  { sku: "HAMPER-002", name: "Hampers Nusantara", category: "Hampers", cost: 105000, price: 195000, stock: 5, reorderPoint: 3, unit: "box", color: "#d946ef" },
  { sku: "SAMBAL-001", name: "Sambal Cumi Asin", category: "Makanan", cost: 23000, price: 48000, stock: 21, reorderPoint: 8, unit: "jar", color: "#ef4444" },
  { sku: "SAMBAL-002", name: "Sambal Bawang Roa", category: "Makanan", cost: 20500, price: 45000, stock: 14, reorderPoint: 8, unit: "jar", color: "#f43f5e" },
];

const channels: Transaction["channel"][] = ["WhatsApp", "Marketplace", "Toko"];
const baseDate = new Date("2026-09-08T05:00:00.000Z");

export const transactions: Transaction[] = Array.from({ length: 180 }, (_, index) => {
  const product = products[(index * 7 + Math.floor(index / 5)) % products.length];
  const dayOffset = (index * 11 + Math.floor(index / 3)) % 90;
  const date = new Date(baseDate);
  date.setUTCDate(date.getUTCDate() - dayOffset);
  date.setUTCHours(2 + (index % 12), (index * 13) % 60);
  const quantity = 1 + ((index * 3) % 6);
  const isPurchase = index % 17 === 0;
  const unitPrice = isPurchase ? product.cost : product.price;
  const type: Transaction["type"] = isPurchase ? "Pembelian" : "Penjualan";
  const status: Transaction["status"] = index % 29 === 0 ? "Dibatalkan" : index % 13 === 0 ? "Diproses" : "Selesai";
  return {
    id: `TRX-${String(2609000 + index).padStart(7, "0")}`,
    date: date.toISOString(),
    sku: product.sku,
    productName: product.name,
    category: product.category,
    type,
    quantity,
    unitPrice,
    total: quantity * unitPrice,
    channel: channels[index % channels.length],
    status,
  };
}).sort((a, b) => b.date.localeCompare(a.date));

export const categories = ["Semua kategori", ...Array.from(new Set(products.map((item) => item.category)))];

export function filterTransactions(filters: DashboardFilters): Transaction[] {
  const from = new Date(baseDate);
  from.setUTCDate(from.getUTCDate() - filters.period + 1);
  return transactions.filter((item) =>
    item.date >= from.toISOString() &&
    (filters.category === "Semua kategori" || item.category === filters.category),
  );
}

export function getDashboardMetrics(filters: DashboardFilters) {
  const filtered = filterTransactions(filters);
  const completedSales = filtered.filter((item) => item.type === "Penjualan" && item.status === "Selesai");
  const revenue = completedSales.reduce((sum, item) => sum + item.total, 0);
  const units = completedSales.reduce((sum, item) => sum + item.quantity, 0);
  const profit = completedSales.reduce((sum, item) => {
    const product = products.find((entry) => entry.sku === item.sku);
    return sum + (item.unitPrice - (product?.cost ?? 0)) * item.quantity;
  }, 0);
  const dailyMap = new Map<string, DailyMetric>();
  const start = new Date(baseDate);
  start.setUTCDate(start.getUTCDate() - filters.period + 1);
  for (let index = 0; index < filters.period; index += 1) {
    const current = new Date(start);
    current.setUTCDate(start.getUTCDate() + index);
    const key = current.toISOString().slice(0, 10);
    dailyMap.set(key, {
      date: key,
      label: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" }).format(current),
      omzet: 0,
      laba: 0,
    });
  }
  completedSales.forEach((item) => {
    const key = item.date.slice(0, 10);
    const day = dailyMap.get(key);
    const product = products.find((entry) => entry.sku === item.sku);
    if (day) {
      day.omzet += item.total;
      day.laba += (item.unitPrice - (product?.cost ?? 0)) * item.quantity;
    }
  });
  const categoryMap = new Map<string, CategoryMetric>();
  completedSales.forEach((item) => {
    const product = products.find((entry) => entry.sku === item.sku);
    const current = categoryMap.get(item.category);
    categoryMap.set(item.category, {
      name: item.category,
      value: (current?.value ?? 0) + item.total,
      color: product?.color ?? "#64748b",
    });
  });
  const productSales = products.map((product) => ({
    ...product,
    sold: completedSales.filter((item) => item.sku === product.sku).reduce((sum, item) => sum + item.quantity, 0),
    revenue: completedSales.filter((item) => item.sku === product.sku).reduce((sum, item) => sum + item.total, 0),
  })).sort((a, b) => b.revenue - a.revenue);

  return {
    transactions: filtered,
    revenue,
    profit,
    units,
    averageOrder: completedSales.length ? revenue / completedSales.length : 0,
    completedCount: completedSales.length,
    daily: Array.from(dailyMap.values()),
    categories: Array.from(categoryMap.values()).sort((a, b) => b.value - a.value),
    productSales,
  };
}

export function findProduct(sku: string): Product | undefined {
  return products.find((product) => product.sku === sku);
}
