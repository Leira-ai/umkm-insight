export interface AnalyticsRow {
  type: string;
  amount: number;
  cost?: number;
}

export interface AnalyticsSummary {
  revenue: number;
  cost: number;
  grossProfit: number;
  transactionCount: number;
}

export function calculateGrossProfit(rows: readonly AnalyticsRow[]): number {
  return rows
    .filter((row) => row.type === "income")
    .reduce((total, row) => total + row.amount - (row.cost ?? 0), 0);
}

export function calculateSummary(rows: readonly AnalyticsRow[]): AnalyticsSummary {
  const incomeRows = rows.filter((row) => row.type === "income");
  const revenue = incomeRows.reduce((total, row) => total + row.amount, 0);
  const cost = incomeRows.reduce((total, row) => total + (row.cost ?? 0), 0);

  return {
    revenue,
    cost,
    grossProfit: revenue - cost,
    transactionCount: rows.length,
  };
}
