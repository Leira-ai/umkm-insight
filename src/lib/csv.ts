import Papa from "papaparse";

export interface CsvTransaction {
  date: string;
  description: string;
  category: string;
  amount: number;
  cost: number;
}

const FORMULA_PREFIX = /^[=+\-@]/u;

function normalizeRow(row: Record<string, string>): CsvTransaction {
  const amount = Number(row.amount);
  const cost = Number(row.cost);
  if (!row.date || !row.description || !row.category || !Number.isFinite(amount) || !Number.isFinite(cost)) {
    throw new Error("CSV berisi data transaksi yang tidak valid.");
  }
  return { date: row.date, description: row.description, category: row.category, amount, cost };
}

export function parseTransactionsCsv(source: string): CsvTransaction[] {
  const result = Papa.parse<Record<string, string>>(source.replace(/^\uFEFF/u, ""), {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim().toLowerCase(),
  });
  if (result.errors.length > 0) throw new Error(result.errors[0].message);
  return result.data.map(normalizeRow);
}

function neutralizeFormula(value: string): string {
  return FORMULA_PREFIX.test(value) ? `'${value}` : value;
}

export function transactionsToCsv(rows: readonly CsvTransaction[]): string {
  return Papa.unparse(
    rows.map((row) => ({ ...row, description: neutralizeFormula(row.description), category: neutralizeFormula(row.category) })),
    { columns: ["date", "description", "category", "amount", "cost"] },
  );
}
