import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CashFlowTool from "@/components/CashFlowTool";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "DebtCapacityPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("keywords").split("|"),
    alternates: {
      canonical: `/${locale}/tools/debt-repayment-capacity`,
      languages: Object.fromEntries(
        routing.locales.map((language) => [
          language,
          `/${language}/tools/debt-repayment-capacity`,
        ]),
      ),
    },
    openGraph: {
      title: `${t("metaTitle")} · ${site.name}`,
      description: t("metaDescription"),
      url: `/${locale}/tools/debt-repayment-capacity`,
    },
  };
}

export default async function DebtRepaymentCapacityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "DebtCapacityPage" });
  const url = `${site.url}/${locale}/tools/debt-repayment-capacity`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "EUR",
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
        <div className="overline mb-3">{t("overline")}</div>
        <h1 className="mb-5 max-w-[920px] font-display text-[clamp(38px,8vw,60px)] leading-[1.04] font-bold text-ink">
          {t("title")}
        </h1>
        <p className="mb-6 max-w-[760px] text-lg leading-relaxed">{t("intro")}</p>
        <div className="mb-10 flex flex-wrap gap-2">
          {(["free", "private", "interactive", "thirteenWeeks"] as const).map(
            (item) => (
              <span
                key={item}
                className="rounded-full border-2 border-ink bg-white px-3 py-2 text-xs font-bold text-ink shadow-hard-sm"
              >
                {t(`badge.${item}`)}
              </span>
            ),
          )}
        </div>

        <CashFlowTool />

        <section className="mt-16 grid gap-6 lg:grid-cols-2" aria-labelledby="debt-capacity-how">
          <div className="card p-6 sm:p-8">
            <h2 id="debt-capacity-how" className="mb-4 font-display text-2xl font-bold text-ink">
              {t("howTitle")}
            </h2>
            <p className="mb-4 leading-relaxed">{t("howTextOne")}</p>
            <p className="leading-relaxed">{t("howTextTwo")}</p>
          </div>
          <div className="card bg-marker p-6 sm:p-8">
            <h2 className="mb-4 font-display text-2xl font-bold text-ink">{t("mattersTitle")}</h2>
            <p className="mb-4 leading-relaxed font-semibold text-ink">{t("mattersText")}</p>
            <p className="text-sm leading-relaxed font-semibold text-ink">{t("disclaimer")}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

