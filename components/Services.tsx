import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { getServices, type ServiceId } from "@/lib/services";

const ICONS: Record<Exclude<ServiceId, "unsure">, React.ReactNode> = {
  bookkeeping: (
    <>
      <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" />
      <path d="M9 9h6M9 13h6" />
    </>
  ),
  budgets: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  cashflow: <path d="M3 15c3-8 6-8 9 0s6 8 9 0" />,
  tax: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  reporting: (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4-5" />
    </>
  ),
  leasebuy: (
    <>
      <path d="M12 4v16M5 20h14M5 8h14" />
      <path d="M5 8l-3 6a3 3 0 0 0 6 0L5 8zM19 8l-3 6a3 3 0 0 0 6 0l-3-6z" />
    </>
  ),
};

export default function Services() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Services");
  const cards = getServices(locale).filter((service) => service.id !== "unsure");

  return (
    <section id="services" className="section-shell scroll-mt-4">
      <div className="overline mb-3">{t("overline")}</div>
      <h2 className="h2 mb-5 max-w-[720px]">{t("title")}</h2>
      <p className="section-intro mb-10">{t("intro")}</p>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((s) => (
          <div key={s.id} className="professional-card card flex flex-col gap-4 p-7">
            <div className="flex size-12 items-center justify-center rounded-full bg-ledger-tint text-ledger">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICONS[s.id as Exclude<ServiceId, "unsure">]}
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-ink">{s.label}</h3>
            <p className="text-[15px] leading-[1.7]">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
