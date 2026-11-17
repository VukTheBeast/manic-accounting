import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function FreeToolsPreview() {
  const t = useTranslations("FreeToolsPreview");

  return (
    <section
      id="free-tools"
      className="mx-auto max-w-[1200px] scroll-mt-4 px-5 pb-24 sm:px-8"
    >
      <div className="overline mb-3">{t("overline")}</div>
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 className="h2 mb-4 max-w-[760px]">{t("title")}</h2>
          <p className="max-w-[680px] text-[17px] leading-relaxed">{t("intro")}</p>
        </div>
        <Link href="/tools" className="btn-ghost">{t("browseAll")}</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="card group flex flex-col overflow-hidden">
          <div
            className="grid min-h-44 grid-cols-[repeat(13,minmax(0,1fr))] items-end gap-1 border-b-2 border-ink bg-ledger-tint px-6 pt-7"
            aria-hidden="true"
          >
            {[46, 58, 68, 61, 76, 82, 72, 49, 56, 64, 71, 79, 87].map(
              (height, index) => (
                <span
                  key={index}
                  className={`rounded-t-[3px] ${
                    index === 7 ? "bg-marker" : "bg-ledger"
                  }`}
                  style={{ height: `${height}%` }}
                />
              ),
            )}
          </div>
          <div className="flex flex-1 flex-col p-6">
            <span className="mb-3 font-mono text-xs font-bold text-ledger">{t("free")}</span>
            <h3 className="mb-3 font-display text-2xl font-bold text-ink">
              {t("debtTitle")}
            </h3>
            <p className="mb-6 leading-relaxed">{t("debtText")}</p>
            <Link href="/tools/debt-repayment-capacity" className="btn-marker mt-auto">
              {t("openDebt")}
            </Link>
          </div>
        </article>

        <article className="card group flex flex-col overflow-hidden">
          <div
            className="flex min-h-44 items-center justify-center border-b-2 border-ink bg-paper p-6"
            aria-hidden="true"
          >
            <div className="grid w-full max-w-sm grid-cols-3 gap-3">
              {(["pnl", "balance", "cash"] as const).map((item, index) => (
                <div
                  key={item}
                  className={`rounded-[9px] border-2 border-ink p-3 ${
                    index === 1 ? "bg-marker" : "bg-white"
                  }`}
                >
                  <div className="mb-3 font-mono text-[10px] font-bold text-ledger">
                    {t(`statement.${item}`)}
                  </div>
                  <div className="flex flex-col gap-2">
                    {[78, 54, 68].map((width) => (
                      <span
                        key={width}
                        className="h-1.5 rounded-full bg-ledger"
                        style={{ width: `${width}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <span className="mb-3 font-mono text-xs font-bold text-ledger">{t("free")}</span>
            <h3 className="mb-3 font-display text-2xl font-bold text-ink">
              {t("forecastTitle")}
            </h3>
            <p className="mb-6 leading-relaxed">{t("forecastText")}</p>
            <Link href="/tools/three-statement-forecast" className="btn-marker mt-auto">
              {t("openForecast")}
            </Link>
          </div>
        </article>

        <article className="card group flex flex-col overflow-hidden">
          <div
            className="relative flex min-h-44 items-end border-b-2 border-ink bg-ledger-tint p-6"
            aria-hidden="true"
          >
            <svg viewBox="0 0 300 110" className="w-full" role="presentation">
              <line x1="20" y1="90" x2="280" y2="20" stroke="var(--color-ledger)" strokeWidth="5" strokeLinecap="round" />
              <line x1="20" y1="35" x2="280" y2="92" stroke="var(--color-red-pen)" strokeWidth="5" strokeLinecap="round" />
              <circle cx="165" cy="51" r="9" fill="var(--color-marker)" stroke="var(--color-ink)" strokeWidth="3" />
            </svg>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <span className="mb-3 font-mono text-xs font-bold text-ledger">{t("free")}</span>
            <h3 className="mb-3 font-display text-2xl font-bold text-ink">
              {t("breakEvenTitle")}
            </h3>
            <p className="mb-6 leading-relaxed">{t("breakEvenText")}</p>
            <Link href="/tools/pricing-margin-break-even" className="btn-marker mt-auto">
              {t("openBreakEven")}
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

