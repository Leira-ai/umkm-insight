import { beforeAll, describe, expect, it } from "vitest";
import {
  loadDomainModule,
  pickFunction,
  type DomainModule,
} from "./domain-module";

const candidates = [
  "csv",
  "csv-utils",
  "csv-parser",
  "domain/csv",
  "utils/csv",
];
let csv: DomainModule | null = null;

function parsedRows(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value as Record<string, unknown>[];
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    const rows = object.data ?? object.rows ?? object.transactions;
    if (Array.isArray(rows)) return rows as Record<string, unknown>[];
  }
  throw new Error("CSV parser must return rows or an object containing data/rows");
}

async function call(value: unknown): Promise<unknown> {
  return value instanceof Promise ? value : Promise.resolve(value);
}

beforeAll(async () => {
  csv = await loadDomainModule(candidates);
});

describe("domain CSV", () => {
  it("provides the expected pure CSV module", () => {
    expect(
      csv,
      `Create src/lib/${candidates[0]}.ts with CSV parse and export helpers`,
    ).not.toBeNull();
  });

  it("parses headers, quoted commas, CRLF, and numeric fields", async () => {
    if (!csv) return;

    const parseCsv = pickFunction(csv, [
      "parseTransactionsCsv",
      "parseTransactionCSV",
      "parseCsv",
      "parseCSV",
    ]);
    const source = [
      "date,description,category,amount,cost",
      '2026-01-02,"Produk, paket A",Produk,200000,120000',
      "2026-01-03,Konsultasi,Jasa,150000,50000",
    ].join("\r\n");
    const rows = parsedRows(await call(parseCsv(source)));

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      date: "2026-01-02",
      description: "Produk, paket A",
      category: "Produk",
      amount: 200_000,
      cost: 120_000,
    });
  });

  it("ignores a trailing blank row", async () => {
    if (!csv) return;

    const parseCsv = pickFunction(csv, [
      "parseTransactionsCsv",
      "parseTransactionCSV",
      "parseCsv",
      "parseCSV",
    ]);
    const source =
      "date,description,category,amount,cost\n2026-01-02,Produk,Penjualan,1000,500\n\n";

    expect(parsedRows(await call(parseCsv(source)))).toHaveLength(1);
  });

  it("rejects invalid numeric transaction values instead of producing NaN", async () => {
    if (!csv) return;

    const parseCsv = pickFunction(csv, [
      "parseTransactionsCsv",
      "parseTransactionCSV",
      "parseCsv",
      "parseCSV",
    ]);
    const source =
      "date,description,category,amount,cost\n2026-01-02,Rusak,Produk,bukan-angka,500";

    let rejected = false;
    try {
      const result = await call(parseCsv(source));
      if (result && typeof result === "object" && !Array.isArray(result)) {
        const errors = (result as Record<string, unknown>).errors;
        rejected = Array.isArray(errors) && errors.length > 0;
      }
    } catch {
      rejected = true;
    }

    expect(rejected).toBe(true);
  });

  it("exports a round-trippable CSV and escapes commas", async () => {
    if (!csv) return;

    const parseCsv = pickFunction(csv, [
      "parseTransactionsCsv",
      "parseTransactionCSV",
      "parseCsv",
      "parseCSV",
    ]);
    const exportCsv = pickFunction(csv, [
      "transactionsToCsv",
      "exportTransactionsCsv",
      "exportToCSV",
      "unparseCsv",
    ]);
    const input = [
      {
        date: "2026-01-02",
        description: "Produk, paket A",
        category: "Produk",
        amount: 200_000,
        cost: 120_000,
      },
    ];
    const output = await call(exportCsv(input));

    expect(typeof output).toBe("string");
    expect(String(output)).toContain('"Produk, paket A"');
    expect(parsedRows(await call(parseCsv(String(output))))[0]).toMatchObject(
      input[0],
    );
  });
});
