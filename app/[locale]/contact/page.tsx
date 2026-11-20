import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: Object.fromEntries(
        routing.locales.map((language) => [language, `/${language}/contact`]),
      ),
    },
    openGraph: {
      title: `${t("contactTitle")} · ${site.name}`,
      description: t("contactDescription"),
      url: `/${locale}/contact`,
    },
  };
}

const TIPS = ["tipOne", "tipTwo", "tipThree"] as const;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "ContactPage" });

  return (
    <div className="ledger-paper">
      <Header />
      <main id="main-content" className="mx-auto max-w-[1200px] px-5 pt-8 pb-24 sm:px-8">
        <div className="overline mb-3">{t("overline")}</div>
        <h1 className="mb-4 max-w-[760px] font-display text-[clamp(34px,8vw,56px)] leading-[1.05] font-bold text-ink">
          {t("title")}
        </h1>
        <p className="mb-10 max-w-[620px] text-[17px] leading-relaxed">
          {t("intro")}
        </p>

        <div className="flex flex-wrap items-start gap-8">
          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
            <div className="card flex flex-col gap-3 p-6">
              <div className="text-xs font-bold tracking-[0.6px] text-ink">
                {t("directTitle")}
              </div>
              <a
                href={`mailto:${site.email}`}
                className="flex min-h-11 items-center gap-3 font-display text-lg font-bold text-ink transition-colors hover:text-ledger"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0 text-ledger"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
                <span className="break-all">{site.email}</span>
              </a>
              <p className="text-sm leading-relaxed">{t("directText")}</p>
            </div>
            <div className="card flex flex-col gap-3 p-6">
              <div className="text-xs font-bold tracking-[0.6px] text-ink">{t("helpful")}</div>
              {TIPS.map((tip) => (
                <div key={tip} className="flex gap-2.5 text-[15px] leading-normal">
                  <span className="flex-none font-bold text-ledger" aria-hidden="true">✓</span>
                  <span>{t(tip)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-[2_1_420px]">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
