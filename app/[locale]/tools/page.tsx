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
      languages: Object.fromEntries(
        routing.locales.map((language) => [language, `/${language}/tools`]),
      ),
    },
    openGraph: {
      title: `${t("metaTitle")} · ${site.name}`,
      description: t("metaDescription"),
      url: `/${locale}/tools`,
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

  return (
    <div className="ledger-paper">
      <Header />
      <main id="main-content" className="mx-auto max-w-[1200px] px-5 pt-10 pb-24 sm:px-8">
        <div className="overline mb-3">{t("overline")}</div>
        <h1 className="mb-5 max-w-[850px] font-display text-[clamp(38px,8vw,60px)] leading-[1.04] font-bold text-ink">
          {t("title")}
        </h1>
        <p className="mb-12 max-w-[720px] text-lg leading-relaxed">{t("intro")}</p>

        <section aria-labelledby="available-tools">
          <h2 id="available-tools" className="h2 mb-7">{t("available")}</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="card flex flex-col overflow-hidden">
              <div className="border-b-2 border-ink bg-marker p-6 text-ink">
                <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs font-bold text-paper">
                  {t("free")}
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold">{t("debtTitle")}</h3>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="mb-5 leading-relaxed">{t("debtText")}</p>
                <ul className="mb-7 flex flex-col gap-2 text-sm font-semibold text-ink">
                  {(["debtOne", "debtTwo", "debtThree"] as const).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-ledger" aria-hidden="true">✓</span>
                      {t(item)}
                    </li>
                  ))}
                </ul>
                <Link href="/tools/debt-repayment-capacity" className="btn-marker mt-auto">
                  {t("openDebt")}
                </Link>
              </div>
            </article>

            <article className="card flex flex-col overflow-hidden">
              <div className="border-b-2 border-ink bg-ledger p-6 text-white">
                <span className="rounded-full bg-marker px-3 py-1 font-mono text-xs font-bold text-ink">
                  {t("free")}
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold">{t("forecastTitle")}</h3>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="mb-5 leading-relaxed">{t("forecastText")}</p>
                <ul className="mb-7 flex flex-col gap-2 text-sm font-semibold text-ink">
                  {(["forecastOne", "forecastTwo", "forecastThree"] as const).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-ledger" aria-hidden="true">✓</span>
                      {t(item)}
                    </li>
                  ))}
                </ul>
                <Link href="/tools/three-statement-forecast" className="btn-marker mt-auto">
                  {t("openForecast")}
                </Link>
              </div>
            </article>

            <article className="card flex flex-col overflow-hidden">
              <div className="border-b-2 border-ink bg-paper p-6 text-ink">
                <span className="rounded-full bg-ledger px-3 py-1 font-mono text-xs font-bold text-white">
                  {t("free")}
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold">{t("breakEvenTitle")}</h3>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="mb-5 leading-relaxed">{t("breakEvenText")}</p>
                <ul className="mb-7 flex flex-col gap-2 text-sm font-semibold text-ink">
                  {(["breakEvenOne", "breakEvenTwo", "breakEvenThree"] as const).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-ledger" aria-hidden="true">✓</span>
                      {t(item)}
                    </li>
                  ))}
                </ul>
                <Link href="/tools/pricing-margin-break-even" className="btn-marker mt-auto">
                  {t("openBreakEven")}
                </Link>
              </div>
            </article>

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

