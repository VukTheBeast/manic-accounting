import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThreeStatementForecaster from "@/components/ThreeStatementForecaster";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "ThreeStatementPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("keywords").split("|"),
    alternates: {
      canonical: `/${locale}/tools/three-statement-forecast`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((language) => [
            language,
            `/${language}/tools/three-statement-forecast`,
          ]),
        ),
        "x-default": "/en/tools/three-statement-forecast",
      },
    },
    openGraph: {
      title: `${t("metaTitle")} · ${site.name}`,
      description: t("metaDescription"),
      url: `/${locale}/tools/three-statement-forecast`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("metaTitle")} · ${site.name}`,
      description: t("metaDescription"),
    },
  };
}

export default async function ThreeStatementForecastPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "ThreeStatementPage" });
  const toolsT = await getTranslations({ locale, namespace: "ToolsPage" });
  const url = `${site.url}/${locale}/tools/three-statement-forecast`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: locale,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "EUR",
      availability: "https://schema.org/OnlineOnly",
    },
    provider: {
      "@type": "AccountingService",
      name: site.name,
      url: site.url,
    },
  };

  return (
    <div className="ledger-paper">
      <Header />
      <main id="main-content" className="mx-auto max-w-[1200px] px-5 pt-10 pb-24 sm:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Link href="/tools" className="mb-5 inline-flex min-h-11 items-center font-bold text-ledger underline decoration-2 underline-offset-4">
          {toolsT("backToTools")}
        </Link>
        <div className="overline mb-3">{t("overline")}</div>
        <h1 className="mb-5 max-w-[940px] font-display text-[clamp(38px,8vw,60px)] leading-[1.04] font-bold text-ink">
          {t("title")}
        </h1>
        <p className="mb-6 max-w-[760px] text-lg leading-relaxed">{t("intro")}</p>
        <div className="mb-10 flex flex-wrap gap-2">
          {(["free", "private", "excel", "serviceBusiness"] as const).map((item) => (
            <span key={item} className="rounded-full border-2 border-ink bg-white px-3 py-2 text-xs font-bold text-ink shadow-hard-sm">
              {t(`badge.${item}`)}
            </span>
          ))}
        </div>

        <ThreeStatementForecaster />

        <section className="mt-16 grid gap-6 lg:grid-cols-2" aria-labelledby="how-it-works">
          <div className="card p-6 sm:p-8">
            <h2 id="how-it-works" className="mb-4 font-display text-2xl font-bold text-ink">
              {t("howTitle")}
            </h2>
            <p className="mb-4 leading-relaxed">{t("howTextOne")}</p>
            <p className="leading-relaxed">{t("howTextTwo")}</p>
          </div>
          <div className="card bg-marker p-6 sm:p-8">
            <h2 className="mb-4 font-display text-2xl font-bold text-ink">{t("limitsTitle")}</h2>
            <p className="mb-4 leading-relaxed font-semibold text-ink">{t("limitsText")}</p>
            <p className="text-sm leading-relaxed font-semibold text-ink">{t("disclaimer")}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

