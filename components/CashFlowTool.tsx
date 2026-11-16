"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

type Key = "opening" | "cin" | "cout" | "debt" | "oneoff" | "buffer";
type Scenario = "base" | "salesDip" | "costRise";

const SLIDERS = [
  { key: "opening", id: "sl-open", label: "opening", max: 60000 },
  { key: "cin", id: "sl-in", label: "cashIn", max: 30000 },
  { key: "cout", id: "sl-out", label: "cashOut", max: 30000 },
  { key: "debt", id: "sl-debt", label: "debtPayment", max: 20000 },
  { key: "oneoff", id: "sl-one", label: "oneOff", max: 50000 },
  { key: "buffer", id: "sl-buffer", label: "cashBuffer", max: 30000 },
] as const satisfies readonly { key: Key; id: string; label: string; max: number }[];

const SCENARIOS = ["base", "salesDip", "costRise"] as const;
const WEEKS = 13;
const CHART_H = 260;
const PAD = 14;

function projectBalances(
  opening: number,
  weeklyIn: number,
  weeklyOut: number,
  weeklyDebt: number,
  oneOff: number,
) {
  const balances: number[] = [];
  let balance = opening;

  for (let week = 1; week <= WEEKS; week++) {
    balance += weeklyIn - weeklyOut - weeklyDebt - (week === 8 ? oneOff : 0);
    balances.push(balance);
  }

  return balances;
}

export default function CashFlowTool() {
  const t = useTranslations("CashFlow");
  const format = useFormatter();
  const fmt = (number: number) =>
    format.number(Math.round(number), { maximumFractionDigits: 0 });
  const [values, setValues] = useState<Record<Key, number>>({
    opening: 20000,
    cin: 12000,
    cout: 8500,
    debt: 1500,
    oneoff: 12000,
    buffer: 5000,
  });
  const [scenario, setScenario] = useState<Scenario>("base");
  const [selectedWeek, setSelectedWeek] = useState(7);

  const weeklyIn = scenario === "salesDip" ? values.cin * 0.85 : values.cin;
  const weeklyOut = scenario === "costRise" ? values.cout * 1.1 : values.cout;
  const balances = projectBalances(
    values.opening,
    weeklyIn,
    weeklyOut,
    values.debt,
    values.oneoff,
  );

  const keepsBuffer = (weeklyDebt: number) =>
    projectBalances(
      values.opening,
      weeklyIn,
      weeklyOut,
      weeklyDebt,
      values.oneoff,
    ).every((balance) => balance >= values.buffer);

  let safeWeeklyDebt = 0;
  if (keepsBuffer(0)) {
    let low = 0;
    let high = 50000;
    for (let step = 0; step < 32; step++) {
      const midpoint = (low + high) / 2;
      if (keepsBuffer(midpoint)) low = midpoint;
      else high = midpoint;
    }
    safeWeeklyDebt = Math.floor(low / 50) * 50;
  }

  const lowest = Math.min(...balances);
  const lowWeek = balances.indexOf(lowest) + 1;
  const headroom = lowest - values.buffer;
  const plannedTotal = values.debt * WEEKS;
  const operatingSurplus = weeklyIn - weeklyOut;
  const coverage =
    values.debt > 0 ? Math.max(0, operatingSurplus / values.debt) : null;
  const status =
    lowest < 0 ? "shortfall" : headroom < 0 ? "tight" : "healthy";
  const selectedBalance = balances[selectedWeek];
  const selectedStatus =
    selectedBalance < 0
      ? "belowZero"
      : selectedBalance < values.buffer
        ? "belowBuffer"
        : "aboveBuffer";

  const minV = Math.min(0, ...balances);
  const maxV = Math.max(values.buffer, ...balances, 1);
  const range = maxV - minV || 1;
  const usable = CHART_H - 2 * PAD;
  const zeroY = PAD + (maxV / range) * usable;
  const bufferY = PAD + ((maxV - values.buffer) / range) * usable;
  const verdict = t(`verdict.${status}`, {
    planned: fmt(values.debt),
    safe: fmt(safeWeeklyDebt),
    amount: fmt(Math.abs(headroom)),
    week: lowWeek,
  });

  return (
    <div className="cashflow-tool card overflow-hidden">
      <div className="border-b-2 border-ink bg-ink px-5 py-5 text-paper sm:px-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1 text-[11px] font-bold tracking-[0.8px] text-marker">
              {t("scenarioLabel")}
            </div>
            <div className="font-display text-xl font-bold">{t("analysisTitle")}</div>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("scenarioLabel")}>
            {SCENARIOS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={scenario === item}
                onClick={() => setScenario(item)}
                className={`min-h-11 rounded-[9px] border px-3 py-2 text-xs font-bold transition-colors ${
                  scenario === item
                    ? "border-marker bg-marker text-ink"
                    : "border-paper/40 text-paper hover:border-paper"
                }`}
              >
                {t(`scenario.${item}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 p-[clamp(20px,4vw,32px)] lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.55fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="rounded-[10px] border border-grid bg-paper p-4">
            <p className="text-sm leading-relaxed font-semibold text-ink">
              {t(`scenarioNote.${scenario}`)}
            </p>
          </div>

          {SLIDERS.map((slider) => (
            <div key={slider.key} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={slider.id} className="text-[12.5px] font-bold text-ink">
                  {t(slider.label)}
                </label>
                <span className="font-mono text-[17px] font-semibold text-ink tabular-nums">
                  {fmt(values[slider.key])}
                </span>
              </div>
              <input
                id={slider.id}
                type="range"
                min={0}
                max={slider.max}
                step={500}
                value={values[slider.key]}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [slider.key]: Number(event.target.value),
                  }))
                }
                className="h-7 w-full accent-ledger"
              />
            </div>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div
              className={`rounded-[11px] border-2 p-4 ${
                values.debt <= safeWeeklyDebt
                  ? "border-ledger bg-ledger-tint"
                  : "border-red-pen bg-red-tint"
              }`}
            >
              <div className="mb-2 text-[10px] font-bold tracking-[0.65px] text-ledger">
                {t("safeWeekly")}
              </div>
              <div className="font-mono text-2xl font-bold text-ink tabular-nums">
                {fmt(safeWeeklyDebt)}
              </div>
              <div className="mt-1 text-xs font-semibold text-body">{t("perWeek")}</div>
            </div>
            <div className="rounded-[11px] border-2 border-ink bg-paper p-4">
              <div className="mb-2 text-[10px] font-bold tracking-[0.65px] text-ink">
                {t("plannedTotal")}
              </div>
              <div className="font-mono text-2xl font-bold text-ink tabular-nums">
                {fmt(plannedTotal)}
              </div>
              <div className="mt-1 text-xs font-semibold text-body">{t("overThirteenWeeks")}</div>
            </div>
            <div
              className={`rounded-[11px] border-2 p-4 ${
                headroom >= 0
                  ? "border-ledger bg-ledger-tint"
                  : "border-red-pen bg-red-tint"
              }`}
            >
              <div className="mb-2 text-[10px] font-bold tracking-[0.65px] text-ink">
                {headroom >= 0 ? t("bufferHeadroom") : t("bufferShortfall")}
              </div>
              <div className="font-mono text-2xl font-bold text-ink tabular-nums">
                {fmt(Math.abs(headroom))}
              </div>
              <div className="mt-1 text-xs font-semibold text-body">
                {t("lowestInWeek", { week: lowWeek })}
              </div>
            </div>
          </div>

          <div className="rounded-[12px] border-2 border-ink bg-white p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold tracking-[0.6px] text-ink">{t("chartTitle")}</div>
                <div className="mt-1 text-xs font-semibold text-body">
                  {coverage === null
                    ? t("coverageNone")
                    : t("coverage", {
                        ratio: format.number(coverage, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        }),
                      })}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-ink">
                <span className="h-px w-5 border-t-2 border-dashed border-marker-dark" />
                {t("bufferLine")}
              </div>
            </div>

            <div
              role="img"
              aria-label={t("chartLabel", { verdict })}
              className="relative overflow-hidden rounded-[9px] bg-paper"
              style={{ height: CHART_H }}
            >
              <div
                className="absolute right-0 left-0 z-10 border-t-2 border-dashed border-marker-dark"
                style={{ top: bufferY }}
              />
              <div
                className="absolute right-0 left-0 z-10 border-t border-dashed border-ink/60"
                style={{ top: zeroY }}
              />
              {balances.map((balance, index) => {
                const height = Math.max((Math.abs(balance) / range) * usable, 3);
                const tone =
                  balance < 0
                    ? "bg-red-pen"
                    : balance < values.buffer
                      ? "bg-marker"
                      : "bg-ledger";

                return (
                  <div
                    key={index}
                    aria-hidden="true"
                    className={`absolute top-0 bottom-0 z-20 rounded-sm ${
                      selectedWeek === index ? "bg-ledger/10" : ""
                    }`}
                    style={{
                      left: `${((index * 100) / WEEKS).toFixed(3)}%`,
                      width: `${(100 / WEEKS).toFixed(3)}%`,
                    }}
                  >
                    <span
                      className={`absolute right-[20%] left-[20%] rounded-t-[3px] ${tone}`}
                      style={{
                        top: balance >= 0 ? zeroY - height : zeroY,
                        height,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div
              className="mt-2 grid grid-cols-5 gap-1 md:grid-cols-[repeat(13,minmax(0,1fr))]"
              role="group"
              aria-label={t("weekSelectorLabel")}
            >
              {balances.map((balance, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedWeek(index)}
                  aria-label={t("weekDetail", {
                    week: index + 1,
                    amount: fmt(balance),
                  })}
                  aria-pressed={selectedWeek === index}
                  className={`min-h-11 rounded-[7px] font-mono text-xs font-bold tabular-nums transition-colors ${
                    selectedWeek === index
                      ? "bg-ink text-paper"
                      : "bg-paper text-body hover:bg-ledger-tint hover:text-ledger"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[9px] bg-paper px-4 py-3">
              <div>
                <span className="text-[10px] font-bold tracking-[0.7px] text-ledger">
                  {t("selectedWeek", { week: selectedWeek + 1 })}
                </span>
                <div className="font-mono text-lg font-bold text-ink tabular-nums">
                  {fmt(selectedBalance)}
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  selectedStatus === "aboveBuffer"
                    ? "bg-ledger-tint text-ledger"
                    : selectedStatus === "belowZero"
                      ? "bg-red-tint text-red-pen"
                      : "bg-marker text-ink"
                }`}
              >
                {t(`weekStatus.${selectedStatus}`)}
              </span>
            </div>
          </div>

          <div
            aria-live="polite"
            className={`rounded-[11px] border-2 p-5 ${
              status === "healthy"
                ? "border-ledger bg-ledger-tint"
                : status === "shortfall"
                  ? "border-red-pen bg-red-tint"
                  : "border-ink bg-marker"
            }`}
          >
            <div className="mb-2 text-xs font-bold tracking-[0.65px] text-ink">
              {t("decisionTitle")}
            </div>
            <p className="text-[15px] leading-relaxed font-bold text-ink">{verdict}</p>
          </div>

          <p className="text-xs leading-relaxed font-semibold text-body">{t("disclaimer")}</p>
        </div>
      </div>
    </div>
  );
}
