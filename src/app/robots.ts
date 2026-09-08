import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  return { rules: { userAgent: "*", allow: ["/", "/demo", "/masuk", "/daftar"], disallow: ["/app/", "/auth/"] }, sitemap: site ? new URL("/sitemap.xml", site).toString() : undefined };
}
