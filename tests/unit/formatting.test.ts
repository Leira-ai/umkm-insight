import { beforeAll, describe, expect, it } from "vitest";
import {
  loadDomainModule,
  normalizeSpace,
  pickFunction,
  type DomainModule,
} from "./domain-module";

const candidates = [
  "formatting",
  "formatters",
  "format",
  "utils/formatting",
  "utils/formatters",
  "utils/format",
];
let formatting: DomainModule | null = null;

beforeAll(async () => {
  formatting = await loadDomainModule(candidates);
});

describe("domain formatting", () => {
  it("provides the expected pure formatting module", () => {
    expect(
      formatting,
      `Create src/lib/${candidates[0]}.ts with currency and date formatters`,
    ).not.toBeNull();
  });

  it("formats Indonesian rupiah deterministically", () => {
    if (!formatting) return;

    const formatCurrency = pickFunction(formatting, [
      "formatCurrency",
      "formatRupiah",
      "formatIDR",
    ]);
    const formatted = normalizeSpace(formatCurrency(1_250_000));

    expect(formatted).toMatch(/^Rp\s?1\.250\.000(?:,00)?$/u);
    expect(normalizeSpace(formatCurrency(0))).toMatch(/^Rp\s?0(?:,00)?$/u);
    expect(normalizeSpace(formatCurrency(-50_000))).toMatch(
      /^(?:-Rp\s?50\.000|Rp\s?-50\.000)(?:,00)?$/u,
    );
  });

  it("formats a date using Indonesian day-month-year ordering", () => {
    if (!formatting) return;

    const formatDate = pickFunction(formatting, [
      "formatDate",
      "formatIndonesianDate",
      "formatDisplayDate",
    ]);
    const formatted = normalizeSpace(
      formatDate(new Date("2026-02-03T12:00:00.000Z")),
    ).toLocaleLowerCase("id-ID");

    expect(formatted).toMatch(/\b3\b/u);
    expect(formatted).toMatch(/(?:feb(?:ruari)?|02)/u);
    expect(formatted).toContain("2026");
  });

  it("does not mutate Date input while formatting", () => {
    if (!formatting) return;

    const formatDate = pickFunction(formatting, [
      "formatDate",
      "formatIndonesianDate",
      "formatDisplayDate",
    ]);
    const input = new Date("2026-07-12T08:30:00.000Z");
    const timestamp = input.getTime();

    formatDate(input);

    expect(input.getTime()).toBe(timestamp);
  });
});
