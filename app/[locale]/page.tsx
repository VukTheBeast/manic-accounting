import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroFinanceVisual from "@/components/HeroFinanceVisual";
import SystemsExperience from "@/components/SystemsExperience";
import Services from "@/components/Services";
import Process from "@/components/Process";
import About from "@/components/About";
import ContactCta from "@/components/ContactCta";
import WorkflowAnimation from "@/components/WorkflowAnimation";
import FreeToolsPreview from "@/components/FreeToolsPreview";
import { getServices } from "@/lib/services";
import { site } from "@/lib/site";

const TRUST = ["trustOne", "trustTwo", "trustThree"] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Home" });
  const metadata = await getTranslations({ locale, namespace: "Metadata" });
  const services = getServices(locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AccountingService",
        "@id": `${site.url}/#business`,
        name: site.name,
        url: `${site.url}/${locale}`,
        logo: `${site.url}/icon.svg`,
        image: `${site.url}/vukman-manic-accounting.webp`,
        description: metadata("description"),
        inLanguage: locale,
        serviceType: services.filter(({ id }) => id !== "unsure").map(
          ({ label }) => label,
        ),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: site.url,
        inLanguage: locale,
        publisher: {
          "@id": `${site.url}/#business`,
        },
      },
    ],
  };

  return (
    <div className="ledger-paper">
      <Header />

      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <section className="hero-shell overflow-hidden bg-ink text-paper">
          <div className="mx-auto grid max-w-[1200px] gap-8 px-5 pt-14 sm:px-8 lg:min-h-[690px] lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-10 lg:pt-12">
            <div className="flex min-w-0 flex-col gap-7 pb-10 lg:py-16">
                <div className="text-[11px] font-bold tracking-[2.4px] text-marker-light uppercase">
                  {t("overline")}
                </div>
                <h1 className="max-w-[680px] font-display text-[clamp(42px,8.5vw,68px)] leading-[1.02] font-bold tracking-[-0.04em] text-paper">
                  {t("headlineOne")}
                  <br />
                  <span className="text-marker-light">{t("headlineTwo")}</span>
                </h1>
                <p className="max-w-[600px] text-lg leading-[1.7] text-paper/78">{t("intro")}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact" className="btn-marker">{t("bookCall")}</Link>
                  <Link
                    href="/tools"
                    className="inline-flex min-h-12 items-center justify-center rounded-[8px] border-2 border-paper/35 px-6 py-3.5 text-base font-bold text-paper transition-[background-color,transform,border-color] hover:-translate-y-0.5 hover:border-paper hover:bg-paper hover:text-ink"
                  >
                    {t("tryTool")}
                  </Link>
                </div>
                <ul className="mt-1 grid gap-2">
                  {TRUST.map((item) => (
                    <li
                      key={item}
                      className="flex min-h-8 items-center gap-3 text-sm font-semibold leading-relaxed text-paper/90"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none text-marker-light">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                      {t(item)}
                    </li>
                  ))}
                </ul>
            </div>

            <HeroFinanceVisual
              portraitAlt={t("portraitAlt")}
              profileRole={t("profileRole")}
              sample={t("sample")}
              profitLabel={t("profitLabel")}
              cashLabel={t("cashLabel")}
              healthy={t("healthy")}
              lowPoint={t("lowPoint")}
              weekEight={t("weekEight")}
              buffer={t("buffer")}
              nineWeeks={t("nineWeeks")}
            />
          </div>
        </section>

        <Services />
        <SystemsExperience />
        <WorkflowAnimation />

        <FreeToolsPreview />

        <Process />
        <About />
        <ContactCta />
      </main>
      <Footer />
    </div>
  );
}
