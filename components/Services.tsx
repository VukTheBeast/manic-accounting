import { SERVICES, type ServiceId } from "@/lib/services";

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
  const cards = SERVICES.filter((s) => s.id !== "unsure");
  return (
    <section id="services" className="mx-auto max-w-[1200px] scroll-mt-4 px-5 pt-10 pb-24 sm:px-8">
      <div className="overline mb-3">WHAT I DO</div>
      <h2 className="h2 mb-4 max-w-[720px]">The boring stuff, done properly.</h2>
      <p className="mb-10 max-w-[640px] text-[17px] leading-relaxed">
        Month-end, tax deadlines, reconciliations, forecasts. The things that never feel urgent
        until they very much are.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
        {cards.map((s) => (
          <div key={s.id} className="card flex flex-col gap-3.5 p-7">
            <div className="flex size-12 items-center justify-center rounded-full bg-marker/40 text-ledger">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICONS[s.id as Exclude<ServiceId, "unsure">]}
              </svg>
            </div>
            <h3 className="text-xl font-bold text-ink">{s.label}</h3>
            <p className="text-[15px] leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
