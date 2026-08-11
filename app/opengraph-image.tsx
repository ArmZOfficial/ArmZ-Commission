import { ImageResponse } from "next/og";
import { loadSeo } from "@/lib/content";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

/** OG image 1200×630 — สร้างอัตโนมัติจากชื่อเว็บ (Latin เนื่องจาก font เริ่มต้น) */
export default async function OpengraphImage() {
  const seo = await loadSeo();
  const accent = /^#[0-9a-fA-F]{6}$/.test(seo.accent) ? seo.accent : "#ffffff";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #070707 0%, #141414 55%, #202020 100%)",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: accent,
              boxShadow: `0 0 40px ${accent}`,
            }}
          />
          <span style={{ fontSize: 26, letterSpacing: 8, color: "#9ca3af", textTransform: "uppercase" }}>
            Mixing & Mastering Studio
          </span>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.05,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>MAKE YOUR TRACK</span>
          <span style={{ color: accent, fontStyle: "italic" }}>SOUND PRO.</span>
        </div>
        <div style={{ marginTop: 44, fontSize: 30, color: "#9ca3af" }}>ArmZChan — {seo.title}</div>
      </div>
    ),
    { ...size }
  );
}
