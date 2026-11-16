import Link from "next/link";
import { site } from "@/lib/site";

export default function ContactCta() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-8">
      <div className="flex flex-wrap items-center gap-x-12 gap-y-7 rounded-card border-2 border-ink bg-marker p-[clamp(24px,5vw,48px)] shadow-hard">
        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3">
          <h2 className="font-display text-[clamp(30px,6vw,44px)] leading-[1.1] font-bold text-ink">
            Tell me what keeps you up at night.
          </h2>
          <p className="text-[17px] leading-relaxed text-ink">
            Late invoices, an unfiled VAT return, a spreadsheet nobody dares open. Pick a topic,
            write a few lines and I will reply within two working days.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <Link href="/contact" className="btn-dark">Write to me</Link>
          <span className="text-sm font-semibold text-ink">or email {site.email}</span>
        </div>
      </div>
    </section>
  );
}
