import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function safeNextPath(value: string | null, fallback = "/app"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export function getSiteUrl(): URL | undefined {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}
