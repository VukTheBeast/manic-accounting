import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LedgerDemo from "@/components/LedgerDemo";
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
        <section className="hero-shell">
          <div className="mx-auto max-w-[1200px] px-5 pt-14 pb-20 sm:px-8 lg:pt-20 lg:pb-24">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="flex min-w-0 flex-col gap-7">
                <div className="text-[11px] font-bold tracking-[2.4px] text-body uppercase">
                  {t("overline")}
                </div>
                <h1 className="max-w-[720px] font-display text-[clamp(42px,8.5vw,68px)] leading-[1.02] font-bold tracking-[-0.04em] text-ink">
                  {t("headlineOne")}
                  <br />
                  <span className="text-ledger">{t("headlineTwo")}</span>
                </h1>
                <p className="max-w-[620px] text-lg leading-[1.7] text-body">{t("intro")}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact" className="btn-marker">{t("bookCall")}</Link>
                  <Link href="/tools" className="btn-ghost">{t("tryTool")}</Link>
                </div>
              </div>
              <div className="min-w-0">
                <LedgerDemo />
              </div>
            </div>
            <ul className="mt-14 grid gap-3 sm:grid-cols-3">
              {TRUST.map((item) => (
                <li
                  key={item}
                  className="flex min-h-14 items-center gap-3 text-sm font-semibold leading-relaxed text-ink"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none text-ledger">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {t(item)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Services />
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
