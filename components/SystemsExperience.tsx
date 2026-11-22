import { useTranslations } from "next-intl";

const ACCOUNTING_SYSTEMS = ["QuickBooks", "Xero", "Money S3", "POHODA"] as const;
const ERP_SYSTEMS = [
  "SAP S/4HANA",
  "SAP GUI",
  "Oracle JD Edwards",
  "Oracle NetSuite",
  "Microsoft Dynamics 365",
] as const;

export default function SystemsExperience() {
  const t = useTranslations("Systems");

  return (
    <section className="border-y border-ink/10 bg-paper/80">
      <div className="section-shell">
        <div className="overline mb-3">{t("overline")}</div>
        <h2 className="h2 mb-5 max-w-[780px]">{t("title")}</h2>
        <p className="section-intro mb-10">{t("intro")}</p>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="card p-7 sm:p-8">
            <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-ledger-tint text-ledger">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M7 8h10M7 12h4M7 16h7" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-ink">
              {t("accountingTitle")}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.7] text-body">
              {t("accountingText")}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2.5" aria-label={t("accountingTitle")}>
              {ACCOUNTING_SYSTEMS.map((system) => (
                <li
                  key={system}
                  className="rounded-full bg-[#e8eef7] px-4 py-2 text-sm font-bold text-ink"
                >
                  {system}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-card border-2 border-ink bg-ink p-7 text-paper shadow-[0_10px_30px_rgba(11,36,71,0.12)] sm:p-8">
            <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-marker text-ink">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 20V8l8-5 8 5v12" />
                <path d="M8 20v-7h8v7M8 9h.01M12 9h.01M16 9h.01" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-paper">
              {t("erpTitle")}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.7] text-paper/70">
              {t("erpText")}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2.5" aria-label={t("erpTitle")}>
              {ERP_SYSTEMS.map((system) => (
                <li
                  key={system}
                  className="rounded-full bg-marker px-4 py-2 text-sm font-bold text-ink"
                >
                  {system}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
