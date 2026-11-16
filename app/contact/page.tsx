import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell me what keeps you up at night. Replies within two working days.",
};

const TIPS = [
  "What kind of business you run",
  "Roughly how many invoices a month",
  "Any deadline that is already looming",
];

export default function ContactPage() {
  return (
    <div className="ledger-paper">
      <Header />
      <main className="mx-auto max-w-[1200px] px-5 pt-8 pb-24 sm:px-8">
        <div className="overline mb-3">CONTACT</div>
        <h1 className="mb-4 max-w-[760px] font-display text-[clamp(34px,8vw,56px)] leading-[1.05] font-bold text-ink">
          Tell me what keeps you up at night.
        </h1>
        <p className="mb-10 max-w-[620px] text-[17px] leading-relaxed">
          Choose what you need help with, write a few lines, and send. I reply within two working
          days. The intro call is free.
        </p>

        <div className="flex flex-wrap items-start gap-8">
          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
            <div className="card flex flex-col gap-3.5 p-6">
              <div className="text-xs font-bold tracking-[0.6px] text-ink">PREFER TO WRITE DIRECTLY?</div>
              <a href={`mailto:${site.email}`} className="text-xl font-bold break-words text-ink hover:text-ledger">
                {site.email}
              </a>
              <div className="text-[15px] leading-relaxed">{site.phone}</div>
            </div>
            <div className="card flex flex-col gap-3 p-6">
              <div className="text-xs font-bold tracking-[0.6px] text-ink">HELPFUL TO MENTION</div>
              {TIPS.map((t) => (
                <div key={t} className="flex gap-2.5 text-[15px] leading-normal">
                  <span className="flex-none font-bold text-ledger" aria-hidden="true">✓</span>
                  <span>{t}</span>
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
