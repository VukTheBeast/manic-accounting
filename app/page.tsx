import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LedgerDemo from "@/components/LedgerDemo";
import CashFlowTool from "@/components/CashFlowTool";
import Services from "@/components/Services";
import Process from "@/components/Process";
import About from "@/components/About";
import ContactCta from "@/components/ContactCta";
import { SERVICES } from "@/lib/services";
import { site } from "@/lib/site";

const TRUST = [
  "A decade in finance and controlling",
  "VAT and tax filing across Czechia, Bulgaria and Romania",
  "Month-end close for EU, US and Canadian entities",
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    image: `${site.url}/vukman-manic-accounting.webp`,
    description: site.description,
    ...(site.email.endsWith("@your-domain.com") ? {} : { email: site.email }),
    serviceType: SERVICES.filter(({ id }) => id !== "unsure").map(
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
            <div className="overline">ACCOUNTING FOR SMALL BUSINESSES &amp; FREELANCERS</div>
            <h1 className="font-display text-[clamp(40px,10.5vw,68px)] leading-[1.02] font-bold text-ink">
              Manic about your numbers.
              <br />
              <span className="box-decoration-clone rounded-md bg-marker px-2.5 text-ink">
                Calm about your books.
              </span>
            </h1>
            <p className="max-w-[520px] text-lg leading-relaxed">
              Hi, I&apos;m Manić. I&apos;ve spent a decade inside the finance teams of big
              multinationals. Now I take on a handful of smaller businesses who want clean books,
              filed taxes and a cash flow they can see coming.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-marker">Book a free intro call</Link>
              <Link href="/#cashflow" className="btn-ghost">Try the cash-flow tool</Link>
            </div>
            <ul className="mt-2 flex flex-col gap-2.5">
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none text-ledger">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 flex-[1_1_440px]">
            <LedgerDemo />
          </div>
        </section>

        <Services />

        <section id="cashflow" className="mx-auto max-w-[1200px] scroll-mt-4 px-5 pb-24 sm:px-8">
          <div className="overline mb-3">PLAY WITH THE NUMBERS</div>
          <h2 className="h2 mb-4 max-w-[760px]">Will you have cash in week 8?</h2>
          <p className="mb-8 max-w-[660px] text-[17px] leading-relaxed">
            A tiny version of the 13-week cash flow forecast I build for clients. Move the sliders,
            and watch when the bank balance dips below zero. Amounts are in your own currency.
          </p>
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
