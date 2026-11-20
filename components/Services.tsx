import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { getServices, type ServiceId } from "@/lib/services";

const ICONS: Record<Exclude<ServiceId, "unsure">, React.ReactNode> = {
  cfo: (
    <>
      <path d="M4 20V10l8-5 8 5v10" />
      <path d="M8 20v-6h8v6M9 10h6" />
    </>
  ),
  planning: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
      <path d="m4 7 6-4 6 6 5-4" />
    </>
  ),
  reporting: (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4-5M7 21h10" />
    </>
  ),
  bookkeeping: (
    <>
      <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" />
      <path d="M9 9h6M9 13h6" />
    </>
  ),
  cashflow: <path d="M3 15c3-8 6-8 9 0s6 8 9 0" />,
  modeling: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2" />
    </>
  ),
  tax: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
      <path d="M9 8h6M9 12h6" />
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
        {cards.map((s, index) => {
          const featured = s.id === "cfo";

          return (
            <article
              key={s.id}
              className={`professional-card card ${
                featured
                  ? "relative overflow-hidden border-ink bg-ink p-8 text-paper md:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-8"
                  : "flex flex-col gap-4 p-7"
              }`}
            >
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
                  featured ? "bg-marker text-ink" : "bg-ledger-tint text-ledger"
                }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {ICONS[s.id as Exclude<ServiceId, "unsure">]}
                </svg>
              </div>
              <div className={featured ? "mt-5 lg:mt-0" : ""}>
                <h3 className={`font-display font-bold ${featured ? "text-[clamp(24px,4vw,34px)] text-paper" : "text-xl text-ink"}`}>
                  {s.label}
                </h3>
                <p className={`mt-3 text-[15px] leading-[1.7] ${featured ? "max-w-[760px] text-paper/70" : "text-body"}`}>
                  {s.desc}
                </p>
              </div>
              <span className={`font-mono text-sm font-bold tabular-nums ${featured ? "mt-6 text-marker lg:mt-0 lg:text-2xl" : "order-first self-end text-mute"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
