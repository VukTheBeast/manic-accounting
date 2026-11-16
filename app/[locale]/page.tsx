import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LedgerDemo from "@/components/LedgerDemo";
import CashFlowTool from "@/components/CashFlowTool";
import Services from "@/components/Services";
import Process from "@/components/Process";
import About from "@/components/About";
import ContactCta from "@/components/ContactCta";
import WorkflowAnimation from "@/components/WorkflowAnimation";
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
    "@type": "AccountingService",
    name: site.name,
    url: `${site.url}/${locale}`,
    logo: `${site.url}/icon.svg`,
    image: `${site.url}/vukman-manic-accounting.webp`,
    description: metadata("description"),
    ...(site.email.endsWith("@your-domain.com") ? {} : { email: site.email }),
    inLanguage: locale,
    serviceType: services.filter(({ id }) => id !== "unsure").map(
      ({ label }) => label,
    ),
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
        <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-14 gap-y-14 px-5 pt-12 pb-22 sm:px-8">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-6">
            <div className="overline">{t("overline")}</div>
            <h1 className="font-display text-[clamp(40px,10.5vw,68px)] leading-[1.02] font-bold text-ink">
              {t("headlineOne")}
              <br />
              <span className="box-decoration-clone rounded-md bg-marker px-2.5 text-ink">
                {t("headlineTwo")}
              </span>
            </h1>
            <p className="max-w-[520px] text-lg leading-relaxed">{t("intro")}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-marker">{t("bookCall")}</Link>
              <Link href="/#cashflow" className="btn-ghost">{t("tryTool")}</Link>
            </div>
            <ul className="mt-2 flex flex-col gap-2.5">
              {TRUST.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none text-ledger">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {t(item)}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 flex-[1_1_440px]">
            <LedgerDemo />
          </div>
        </section>

        <Services />
        <WorkflowAnimation />

        <section id="cashflow" className="mx-auto max-w-[1200px] scroll-mt-4 px-5 pb-24 sm:px-8">
          <div className="overline mb-3">{t("toolOverline")}</div>
          <h2 className="h2 mb-4 max-w-[760px]">{t("toolTitle")}</h2>
          <p className="mb-8 max-w-[660px] text-[17px] leading-relaxed">{t("toolIntro")}</p>
          <CashFlowTool />
        </section>

        <Process />
        <About />
        <ContactCta />
      </main>
      <Footer />
    </div>
  );
}
