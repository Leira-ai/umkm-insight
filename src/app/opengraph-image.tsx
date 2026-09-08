import { ImageResponse } from "next/og";

export const alt = "UMKM Insight — Data sederhana, keputusan lebih mantap";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, color: "white", background: "linear-gradient(135deg,#0f172a 0%,#312e81 70%,#4f46e5 100%)", fontFamily: "sans-serif" }}><div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, fontWeight: 800 }}><div style={{ display: "flex", width: 58, height: 58, alignItems: "center", justifyContent: "center", borderRadius: 16, background: "#6366f1" }}>↗</div><span>UMKM Insight</span></div><div style={{ marginTop: 70, maxWidth: 900, fontSize: 68, lineHeight: 1.05, fontWeight: 900, letterSpacing: -3, display: "flex", flexDirection: "column" }}><span>Data sederhana.</span><span>Keputusan lebih mantap.</span></div><div style={{ marginTop: 36, fontSize: 27, color: "#c7d2fe" }}>Analitik yang mudah dipahami untuk bisnis Indonesia.</div></div>, size);
}
