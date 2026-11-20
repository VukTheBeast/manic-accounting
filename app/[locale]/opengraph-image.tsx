import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const content = {
  en: {
    lineOne: "Manic about your numbers.",
    lineTwo: "Calm about your books.",
    services: "Bookkeeping · month-end close · cash flow · VAT preparation",
  },
  cs: {
    lineOne: "Posedlý vašimi čísly.",
    lineTwo: "Klid ve vašem účetnictví.",
    services: "Účetnictví · měsíční uzávěrky · cash flow · příprava DPH",
  },
  sr: {
    lineOne: "Opsednut vašim brojkama.",
    lineTwo: "Miran zbog vaših knjiga.",
    services: "Knjigovodstvo · mesečno zatvaranje · tok gotovine · priprema PDV-a",
  },
} as const;

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = hasLocale(routing.locales, localeParam)
    ? localeParam
    : routing.defaultLocale;
  const text = content[locale];

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#f7f8fb",
          backgroundImage:
            "linear-gradient(#dde3ec 2px, transparent 2px), linear-gradient(90deg, #dde3ec 2px, transparent 2px)",
          backgroundSize: "48px 48px",
          color: "#0b2447",
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
            border: "4px solid #0b2447",
            borderRadius: "28px",
            boxShadow: "14px 14px 0 #0b2447",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            padding: "64px",
            width: "100%",
          }}
        >
          <div style={{ color: "#b07f20", display: "flex", fontSize: 30, fontWeight: 700 }}>
            {site.name.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>
            <span>{text.lineOne}</span>
            <span
              style={{
                color: "#b07f20",
                borderRadius: "12px",
                display: "flex",
                marginTop: "12px",
                alignSelf: "flex-start",
              }}
            >
              {text.lineTwo}
            </span>
          </div>
          <div style={{ display: "flex", fontSize: 28 }}>
            {text.services}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
