import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export type DomainModule = Record<string, unknown>;

const extensions = [".ts", ".tsx", ".js", ".mjs"];

export async function loadDomainModule(
  candidates: readonly string[],
): Promise<DomainModule | null> {
  for (const candidate of candidates) {
    const paths = [
      ...extensions.map((extension) =>
        resolve(process.cwd(), "src", "lib", `${candidate}${extension}`),
      ),
      ...extensions.map((extension) =>
        resolve(process.cwd(), "src", "lib", candidate, `index${extension}`),
      ),
    ];

    for (const path of paths) {
      if (existsSync(path)) {
        return (await import(pathToFileURL(path).href)) as DomainModule;
      }
    }
  }

  return null;
}

export function pickFunction(
  module: DomainModule,
  names: readonly string[],
): (...args: unknown[]) => unknown {
  for (const name of names) {
    const candidate = module[name];
    if (typeof candidate === "function") {
      return candidate as (...args: unknown[]) => unknown;
    }
  }

  throw new Error(`Expected one of these function exports: ${names.join(", ")}`);
}

export function normalizeSpace(value: unknown): string {
  return String(value).replace(/[\s\u00a0\u202f]+/gu, " ").trim();
}
