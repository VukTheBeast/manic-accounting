"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

type Scenario = "base" | "priceDrop" | "costRise";
type SaleType = "unit" | "hour" | "project";
type ValueKey = "price" | "variableCost" | "fixedCosts" | "volume" | "targetProfit";

const SCENARIOS = ["base", "priceDrop", "costRise"] as const;
const SALE_TYPES = ["unit", "hour", "project"] as const;

const INPUTS = [
  { key: "price", max: 10000, step: 5 },
  { key: "variableCost", max: 10000, step: 5 },
  { key: "fixedCosts", max: 100000, step: 500 },
  { key: "volume", max: 2000, step: 1 },
  { key: "targetProfit", max: 100000, step: 500 },
] as const satisfies readonly {
  key: ValueKey;
  max: number;
  step: number;
}[];

export default function BreakEvenCalculator() {
  const t = useTranslations("BreakEvenTool");
  const format = useFormatter();
  const [scenario, setScenario] = useState<Scenario>("base");
  const [saleType, setSaleType] = useState<SaleType>("unit");
  const [values, setValues] = useState<Record<ValueKey, number>>({
    price: 120,
    variableCost: 40,
    fixedCosts: 8000,
    volume: 130,
    targetProfit: 3000,
  });

  const price = scenario === "priceDrop" ? values.price * 0.95 : values.price;
  const variableCost =
    scenario === "costRise" ? values.variableCost * 1.1 : values.variableCost;
  const contribution = price - variableCost;
  const contributionMargin = price > 0 ? contribution / price : 0;
  const validContribution = contribution > 0;
  const breakEvenVolume = validContribution
    ? Math.ceil(values.fixedCosts / contribution)
    : null;
  const targetVolume = validContribution
    ? Math.ceil((values.fixedCosts + values.targetProfit) / contribution)
    : null;
  const projectedRevenue = price * values.volume;
  const projectedProfit = contribution * values.volume - values.fixedCosts;
  const minimumPrice =
    values.volume > 0
      ? variableCost +
        (values.fixedCosts + values.targetProfit) / values.volume
      : null;
  const marginOfSafety =
    breakEvenVolume !== null && values.volume > 0
      ? (values.volume - breakEvenVolume) / values.volume
      : null;
  const status = !validContribution
    ? "invalid"
    : projectedProfit < 0
      ? "loss"
      : (marginOfSafety ?? 0) < 0.15
        ? "tight"
        : "healthy";

  const fmt = (value: number) =>
    format.number(Math.round(value), { maximumFractionDigits: 0 });
  const maxVolume = Math.max(
    10,
    values.volume,
    breakEvenVolume ?? 0,
    targetVolume ?? 0,
  );
  const chartVolume = Math.ceil(maxVolume * 1.25);
  const chartMaxValue = Math.max(
    1,
    price * chartVolume,
    values.fixedCosts + variableCost * chartVolume,
  );
  const chartX = (volume: number) => 50 + (volume / chartVolume) * 700;
  const chartY = (amount: number) => 225 - (amount / chartMaxValue) * 190;
  const linePoints = (valueAtVolume: (volume: number) => number) =>
    Array.from({ length: 9 }, (_, index) => {
      const volume = (chartVolume * index) / 8;
      return `${chartX(volume).toFixed(1)},${chartY(valueAtVolume(volume)).toFixed(1)}`;
    }).join(" ");

  const verdict = t(`verdict.${status}`, {
    profit: fmt(Math.abs(projectedProfit)),
    units: breakEvenVolume ?? 0,
    contribution: fmt(Math.max(0, contribution)),
  });

  return (
    <div className="free-tool card overflow-hidden">
      <div className="border-b-2 border-ink bg-ink px-5 py-5 text-paper sm:px-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-1 text-[11px] font-bold tracking-[0.8px] text-marker">
              {t("scenarioLabel")}
            </div>
            <h2 className="font-display text-2xl font-bold">{t("title")}</h2>
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
          <div>
            <div className="mb-2 text-xs font-bold tracking-[0.6px] text-ink">
              {t("saleTypeLabel")}
            </div>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label={t("saleTypeLabel")}>
              {SALE_TYPES.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={saleType === item}
                  onClick={() => setSaleType(item)}
                  className={`min-h-11 rounded-[9px] border-2 border-ink px-2 py-2 text-xs font-bold transition-colors ${
                    saleType === item
                      ? "bg-ledger text-white"
                      : "bg-white text-ink hover:bg-ledger-tint"
                  }`}
                >
                  {t(`saleType.${item}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[10px] border border-grid bg-paper p-4">
            <p className="text-sm leading-relaxed font-semibold text-ink">
              {t(`scenarioNote.${scenario}`)}
            </p>
          </div>

          {INPUTS.map((input) => (
            <label key={input.key} className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-bold text-ink">
                {t(`field.${input.key}`, {
                  sale: t(`saleNoun.${saleType}`),
                })}
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={input.max}
                  step={input.step}
                  value={values[input.key]}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [input.key]: Number(event.target.value),
                    }))
                  }
                  className="h-7 min-w-0 flex-1 accent-ledger"
                />
                <input
                  type="number"
                  min={0}
                  step={input.step}
                  value={values[input.key]}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [input.key]: Math.min(
                        input.max,
                        Math.max(0, Number(event.target.value) || 0),
                      ),
                    }))
                  }
                  className="field max-w-32 font-mono tabular-nums"
                />
              </div>
            </label>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[11px] border-2 border-ledger bg-ledger-tint p-4">
              <div className="mb-2 text-[10px] font-bold tracking-[0.65px] text-ledger">
                {t("metric.contribution")}
              </div>
              <div className="font-mono text-2xl font-bold text-ink tabular-nums">
                {fmt(contribution)}
              </div>
              <div className="mt-1 text-xs font-semibold text-body">
                {format.number(contributionMargin, {
                  style: "percent",
                  maximumFractionDigits: 1,
                })}
              </div>
            </div>
            <div className="rounded-[11px] border-2 border-ink bg-paper p-4">
              <div className="mb-2 text-[10px] font-bold tracking-[0.65px] text-ink">
                {t("metric.breakEven")}
              </div>
              <div className="font-mono text-2xl font-bold text-ink tabular-nums">
                {breakEvenVolume === null ? "—" : fmt(breakEvenVolume)}
              </div>
              <div className="mt-1 text-xs font-semibold text-body">
                {t(`salePlural.${saleType}`)}
              </div>
            </div>
            <div className="rounded-[11px] border-2 border-ink bg-paper p-4">
              <div className="mb-2 text-[10px] font-bold tracking-[0.65px] text-ink">
                {t("metric.targetVolume")}
              </div>
              <div className="font-mono text-2xl font-bold text-ink tabular-nums">
                {targetVolume === null ? "—" : fmt(targetVolume)}
              </div>
              <div className="mt-1 text-xs font-semibold text-body">
                {t(`salePlural.${saleType}`)}
              </div>
            </div>
            <div
              className={`rounded-[11px] border-2 p-4 ${
                projectedProfit >= 0
                  ? "border-ledger bg-ledger-tint"
                  : "border-red-pen bg-red-tint"
              }`}
            >
              <div className="mb-2 text-[10px] font-bold tracking-[0.65px] text-ink">
                {t("metric.projectedProfit")}
              </div>
              <div className="font-mono text-2xl font-bold text-ink tabular-nums">
                {fmt(projectedProfit)}
              </div>
              <div className="mt-1 text-xs font-semibold text-body">
                {t("atCurrentVolume")}
              </div>
            </div>
          </div>

          <div className="rounded-[12px] border-2 border-ink bg-white p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold tracking-[0.6px] text-ink">{t("chartTitle")}</h3>
                <p className="mt-1 text-xs font-semibold text-body">
                  {t("chartIntro", { sale: t(`salePlural.${saleType}`) })}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] font-bold text-ink">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-ledger" />
                  {t("revenue")}
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-red-pen" />
                  {t("totalCosts")}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <svg
                viewBox="0 0 800 260"
                width="800"
                height="260"
                role="img"
                aria-label={t("chartLabel", {
                  breakEven: breakEvenVolume ?? 0,
                  sale: t(`salePlural.${saleType}`),
                })}
                className="min-w-full rounded-[9px] bg-paper"
              >
                {[35, 98, 161, 225].map((y) => (
                  <line
                    key={y}
                    x1="40"
                    y1={y}
                    x2="760"
                    y2={y}
                    stroke="var(--color-grid)"
                    strokeWidth="1"
                  />
                ))}
                <polyline
                  points={linePoints((volume) => price * volume)}
                  fill="none"
                  stroke="var(--color-ledger)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <polyline
                  points={linePoints(
                    (volume) => values.fixedCosts + variableCost * volume,
                  )}
                  fill="none"
                  stroke="var(--color-red-pen)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {breakEvenVolume !== null && (
                  <>
                    <line
                      x1={chartX(breakEvenVolume)}
                      y1="25"
                      x2={chartX(breakEvenVolume)}
                      y2="225"
                      stroke="var(--color-ink)"
                      strokeWidth="1.5"
                      strokeDasharray="6 5"
                    />
                    <circle
                      cx={chartX(breakEvenVolume)}
                      cy={chartY(price * breakEvenVolume)}
                      r="7"
                      fill="var(--color-marker)"
                      stroke="var(--color-ink)"
                      strokeWidth="2"
                    />
                  </>
                )}
                <text x="50" y="248" fontSize="11" fontWeight="700" fill="var(--color-body)">
                  0
                </text>
                <text
                  x="750"
                  y="248"
                  textAnchor="end"
                  fontSize="11"
                  fontWeight="700"
                  fill="var(--color-body)"
                >
                  {fmt(chartVolume)}
                </text>
              </svg>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[10px] border-2 border-ink bg-paper p-4">
              <div className="mb-2 text-[10px] font-bold tracking-[0.65px] text-ledger">
                {t("minimumPrice")}
              </div>
              <div className="font-mono text-xl font-bold text-ink tabular-nums">
                {minimumPrice === null ? "—" : fmt(minimumPrice)}
              </div>
              <p className="mt-1 text-xs font-semibold text-body">{t("minimumPriceNote")}</p>
            </div>
            <div className="rounded-[10px] border-2 border-ink bg-paper p-4">
              <div className="mb-2 text-[10px] font-bold tracking-[0.65px] text-ledger">
                {t("breakEvenRevenue")}
              </div>
              <div className="font-mono text-xl font-bold text-ink tabular-nums">
                {breakEvenVolume === null ? "—" : fmt(breakEvenVolume * price)}
              </div>
              <p className="mt-1 text-xs font-semibold text-body">
                {t("projectedRevenue", { amount: fmt(projectedRevenue) })}
              </p>
            </div>
          </div>

          <div
            aria-live="polite"
            className={`rounded-[11px] border-2 p-5 ${
              status === "healthy"
                ? "border-ledger bg-ledger-tint"
                : status === "invalid" || status === "loss"
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
