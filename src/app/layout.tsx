import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const siteUrl = getSiteUrl() ?? new URL("https://umkm-insight.vercel.app");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "UMKM Insight — Data sederhana, keputusan lebih mantap", template: "%s | UMKM Insight" },
  description: "Dashboard analitik sederhana untuk membantu UMKM memahami omzet, laba, produk, dan transaksi.",
  applicationName: "UMKM Insight",
  alternates: siteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    title: "UMKM Insight",
    description: "Ubah catatan transaksi menjadi keputusan bisnis yang lebih mantap.",
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    images: siteUrl ? [{ url: new URL("/opengraph-image", siteUrl), width: 1200, height: 630, alt: "UMKM Insight" }] : undefined,
  },
  twitter: { card: "summary_large_image", title: "UMKM Insight", description: "Data sederhana, keputusan lebih mantap.", images: siteUrl ? [new URL("/opengraph-image", siteUrl)] : undefined },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { colorScheme: "light dark", themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f8fafc" }, { media: "(prefers-color-scheme: dark)", color: "#020617" }] };

const themeScript = `(function(){try{var t=localStorage.getItem('umkm-theme');var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="min-h-dvh overflow-x-hidden antialiased">{children}</body>
    </html>
  );
}
