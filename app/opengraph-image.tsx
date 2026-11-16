import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#fbfbf6",
          backgroundImage:
            "linear-gradient(#dcebdd 2px, transparent 2px), linear-gradient(90deg, #dcebdd 2px, transparent 2px)",
          backgroundSize: "48px 48px",
          color: "#14171a",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "4px solid #14171a",
            borderRadius: "28px",
            boxShadow: "14px 14px 0 #14171a",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            padding: "64px",
            width: "100%",
          }}
        >
          <div style={{ color: "#0b6b4f", display: "flex", fontSize: 30, fontWeight: 700 }}>
            {site.name.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>
            <span>Manic about your numbers.</span>
            <span
              style={{
                backgroundColor: "#ffe14d",
                borderRadius: "12px",
                display: "flex",
                marginTop: "12px",
                padding: "4px 14px",
                alignSelf: "flex-start",
              }}
            >
              Calm about your books.
            </span>
          </div>
          <div style={{ display: "flex", fontSize: 28 }}>
            Bookkeeping · month-end close · cash flow · VAT preparation
          </div>
        </div>
      </div>
    ),
    size,
  );
}
