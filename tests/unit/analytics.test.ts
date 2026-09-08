import { beforeAll, describe, expect, it } from "vitest";
import {
  loadDomainModule,
  pickFunction,
  type DomainModule,
} from "./domain-module";

const candidates = [
  "analytics",
  "dashboard-analytics",
  "metrics",
  "domain/analytics",
  "utils/analytics",
];
let analytics: DomainModule | null = null;

const transactions = [
  {
    id: "sale-1",
    type: "income",
    amount: 200_000,
    cost: 120_000,
    category: "Produk",
    date: "2026-01-02",
  },
  {
    id: "sale-2",
    type: "income",
    amount: 150_000,
    cost: 50_000,
    category: "Jasa",
    date: "2026-01-03",
  },
  {
    id: "expense-1",
    type: "expense",
    amount: 25_000,
    cost: 0,
    category: "Operasional",
    date: "2026-01-04",
  },
] as const;

beforeAll(async () => {
  analytics = await loadDomainModule(candidates);
});

describe("domain analytics", () => {
  it("provides the expected pure analytics module", () => {
    expect(
      analytics,
      `Create src/lib/${candidates[0]}.ts with analytics helpers`,
    ).not.toBeNull();
  });

  it("calculates gross profit without mutating transaction input", () => {
    if (!analytics) return;

    const calculateGrossProfit = pickFunction(analytics, [
      "calculateGrossProfit",
      "getGrossProfit",
      "grossProfit",
    ]);
    const input = transactions.slice(0, 2).map((row) => ({ ...row }));
    const snapshot = structuredClone(input);
    const result = calculateGrossProfit(input);

    expect(result).toBe(180_000);
    expect(input).toEqual(snapshot);
  });

  it("returns zero gross profit for an empty dataset", () => {
    if (!analytics) return;

    const calculateGrossProfit = pickFunction(analytics, [
      "calculateGrossProfit",
      "getGrossProfit",
      "grossProfit",
    ]);

    expect(calculateGrossProfit([])).toBe(0);
  });

  it("summarizes revenue, costs, gross profit, and transaction count", () => {
    if (!analytics) return;

    const summarize = pickFunction(analytics, [
      "calculateSummary",
      "summarizeTransactions",
      "getAnalyticsSummary",
      "calculateMetrics",
    ]);
    const summary = summarize(transactions) as Record<string, unknown>;

    expect(summary).toMatchObject({
      revenue: 350_000,
      grossProfit: 180_000,
      transactionCount: 3,
    });
    expect(summary.cost ?? summary.costOfGoods ?? summary.cogs).toBe(170_000);
  });

  it("handles an empty analytics summary without NaN or Infinity", () => {
    if (!analytics) return;

    const summarize = pickFunction(analytics, [
      "calculateSummary",
      "summarizeTransactions",
      "getAnalyticsSummary",
      "calculateMetrics",
    ]);
    const summary = summarize([]) as Record<string, unknown>;

    expect(summary.revenue).toBe(0);
    expect(summary.grossProfit).toBe(0);
    expect(summary.transactionCount).toBe(0);
    expect(Object.values(summary)).not.toContain(Number.NaN);
    expect(Object.values(summary)).not.toContain(Number.POSITIVE_INFINITY);
  });
});
