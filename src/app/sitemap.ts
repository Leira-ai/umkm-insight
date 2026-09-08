import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  if (!site) return [];
  return ["/", "/demo", "/masuk", "/daftar"].map((path) => ({ url: new URL(path, site).toString(), lastModified: new Date(), changeFrequency: path === "/" ? "weekly" as const : "monthly" as const, priority: path === "/" ? 1 : .7 }));
}
