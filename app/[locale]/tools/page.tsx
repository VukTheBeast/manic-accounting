import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

  const t = await getTranslations({ locale, namespace: "ToolsPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("keywords").split("|"),
    alternates: {
      canonical: `/${locale}/tools`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((language) => [language, `/${language}/tools`]),
        ),
        "x-default": "/en/tools",
      },
    },
    openGraph: {
      title: `${t("metaTitle")} · ${site.name}`,
      description: t("metaDescription"),
      url: `/${locale}/tools`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("metaTitle")} · ${site.name}`,
      description: t("metaDescription"),
    },
  };
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "ToolsPage" });
  const tools = [
    {
      href: "/tools/pricing-margin-break-even" as const,
      title: "breakEvenTitle" as const,
      text: "breakEvenText" as const,
      benefits: ["breakEvenOne", "breakEvenTwo", "breakEvenThree"] as const,
      action: "openBreakEven" as const,
      headerClass: "bg-paper text-ink",
      badgeClass: "bg-ledger text-white",
    },
    {
      href: "/tools/debt-repayment-capacity" as const,
      title: "debtTitle" as const,
      text: "debtText" as const,
      benefits: ["debtOne", "debtTwo", "debtThree"] as const,
      action: "openDebt" as const,
      headerClass: "bg-marker text-ink",
      badgeClass: "bg-ink text-paper",
    },
    {
      href: "/tools/three-statement-forecast" as const,
      title: "forecastTitle" as const,
      text: "forecastText" as const,
      benefits: ["forecastOne", "forecastTwo", "forecastThree"] as const,
      action: "openForecast" as const,
      headerClass: "bg-ledger text-white",
      badgeClass: "bg-marker text-ink",
    },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url: `${site.url}/${locale}/tools`,
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: t(tool.title),
        url: `${site.url}/${locale}${tool.href}`,
      })),
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
        <h1 className="mb-5 max-w-[850px] font-display text-[clamp(38px,8vw,60px)] leading-[1.04] font-bold text-ink">
          {t("title")}
        </h1>
        <p className="mb-12 max-w-[720px] text-lg leading-relaxed">{t("intro")}</p>

        <section aria-labelledby="available-tools">
          <h2 id="available-tools" className="h2 mb-7">{t("available")}</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {tools.map((tool) => (
              <article key={tool.href} className="card flex flex-col overflow-hidden">
                <div className={`border-b-2 border-ink p-6 ${tool.headerClass}`}>
                  <span className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${tool.badgeClass}`}>
                    {t("free")}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold">{t(tool.title)}</h3>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-5 leading-relaxed">{t(tool.text)}</p>
                  <ul className="mb-7 flex flex-col gap-2 text-sm font-semibold text-ink">
                    {tool.benefits.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-ledger" aria-hidden="true">✓</span>
                        {t(item)}
                      </li>
                    ))}
                  </ul>
                  <Link href={tool.href} className="btn-marker mt-auto">
                    {t(tool.action)}
                  </Link>
                </div>
              </article>
            ))}

            <article className="card flex flex-col border-dashed p-6">
              <div className="mb-4 flex size-12 items-center justify-center rounded-[10px] border-2 border-ink bg-paper font-mono text-lg font-bold text-ledger">
                +
              </div>
              <h3 className="mb-3 font-display text-2xl font-bold text-ink">{t("moreTitle")}</h3>
              <p className="mb-6 leading-relaxed">{t("moreText")}</p>
              <div className="mt-auto flex flex-wrap gap-2">
                {(["cashRunway", "hiring"] as const).map((item) => (
                  <span key={item} className="rounded-full border border-ink bg-paper px-3 py-2 text-xs font-bold text-ink">
                    {t(`planned.${item}`)}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

