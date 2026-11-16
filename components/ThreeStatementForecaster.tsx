"use client";

import { useMemo, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import {
  calculateThreeStatementForecast,
  type ForecastInputs,
  type ForecastPeriod,
} from "@/lib/three-statement-forecast";
import { downloadXlsxWorkbook } from "@/lib/xlsx";

type Horizon = "12m" | "24m" | "3y" | "custom";
type Statement = "pnl" | "balance" | "cashFlow";

type NumericKey = Exclude<keyof ForecastInputs, "frequency" | "periods">;

const INITIAL_INPUTS: ForecastInputs = {
  frequency: "monthly",
  periods: 12,
  revenue: 1200000,
  directCosts: 360000,
  operatingExpenses: 600000,
  cash: 120000,
  receivables: 140000,
  otherCurrentAssets: 30000,
  fixedAssets: 250000,
  payables: 50000,
  otherCurrentLiabilities: 40000,
  debt: 180000,
  annualRevenueGrowth: 0.08,
  annualOpexGrowth: 0.04,
  grossMargin: 0.7,
  dso: 42,
  dpo: 30,
  capexPercent: 0.03,
  annualDepreciationRate: 0.2,
  annualInterestRate: 0.06,
  monthlyDebtRepayment: 5000,
  taxRate: 0.21,
};

const PNL_ROWS = [
  "revenue",
  "directCosts",
  "grossProfit",
  "operatingExpenses",
  "ebitda",
  "depreciation",
  "ebit",
  "interestExpense",
  "profitBeforeTax",
  "tax",
  "netIncome",
] as const satisfies readonly (keyof ForecastPeriod)[];

const BALANCE_ROWS = [
  "cash",
  "receivables",
  "otherCurrentAssets",
  "fixedAssets",
  "totalAssets",
  "payables",
  "otherCurrentLiabilities",
  "debt",
  "equity",
  "totalLiabilitiesAndEquity",
  "balanceCheck",
] as const satisfies readonly (keyof ForecastPeriod)[];

const CASH_FLOW_ROWS = [
  "netIncome",
  "depreciation",
  "changeReceivables",
  "changePayables",
  "cashFromOperations",
  "capex",
  "cashFromInvesting",
  "debtRepayment",
  "cashFromFinancing",
  "netCashChange",
  "cash",
] as const satisfies readonly (keyof ForecastPeriod)[];

const INPUT_GROUPS = [
  {
    title: "historicalPnl",
    note: "historicalPnlNote",
    fields: ["revenue", "directCosts", "operatingExpenses"] as const,
  },
  {
    title: "openingBalance",
    note: "openingBalanceNote",
    fields: [
      "cash",
      "receivables",
      "otherCurrentAssets",
      "fixedAssets",
      "payables",
      "otherCurrentLiabilities",
      "debt",
    ] as const,
  },
  {
    title: "forecastDrivers",
    note: "forecastDriversNote",
    fields: [
      "annualRevenueGrowth",
      "annualOpexGrowth",
      "grossMargin",
      "dso",
      "dpo",
      "capexPercent",
      "annualDepreciationRate",
      "annualInterestRate",
      "monthlyDebtRepayment",
      "taxRate",
    ] as const,
  },
] as const;

const PERCENT_FIELDS = new Set<NumericKey>([
  "annualRevenueGrowth",
  "annualOpexGrowth",
  "grossMargin",
  "capexPercent",
  "annualDepreciationRate",
  "annualInterestRate",
  "taxRate",
]);

const DAY_FIELDS = new Set<NumericKey>(["dso", "dpo"]);

function NumberField({
  field,
  value,
  onChange,
}: {
  field: NumericKey;
  value: number;
  onChange: (value: number) => void;
}) {
  const t = useTranslations("ThreeStatementTool");
  const percent = PERCENT_FIELDS.has(field);
  const days = DAY_FIELDS.has(field);
  const shownValue = percent ? value * 100 : value;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-bold text-ink">{t(`field.${field}`)}</span>
      <div className="relative">
        <input
          type="number"
          min={0}
          step={percent ? 0.5 : days ? 1 : 1000}
          value={Number(shownValue.toFixed(percent ? 2 : 0))}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(Number.isFinite(next) ? (percent ? next / 100 : next) : 0);
          }}
          className="field font-mono tabular-nums"
        />
        {(percent || days) && (
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold text-mute">
            {percent ? "%" : t("days")}
          </span>
        )}
      </div>
    </label>
  );
}

function ForecastTable({
  periods,
  rows,
}: {
  periods: ForecastPeriod[];
  rows: readonly (keyof ForecastPeriod)[];
}) {
  const t = useTranslations("ThreeStatementTool");
  const format = useFormatter();
  const fmt = (value: number) =>
    format.number(Math.round(value), { maximumFractionDigits: 0 });

  return (
    <div className="overflow-x-auto rounded-[10px] border-2 border-ink bg-white">
      <table className="min-w-max border-collapse text-sm">
        <thead>
          <tr className="bg-ink text-paper">
            <th className="sticky left-0 z-10 min-w-48 bg-ink px-4 py-3 text-left font-bold">
              {t("lineItem")}
            </th>
            {periods.map((period) => (
              <th key={period.label} className="min-w-28 px-3 py-3 text-right font-mono font-bold">
                {period.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const emphasized =
              row === "grossProfit" ||
              row === "ebitda" ||
              row === "netIncome" ||
              row === "totalAssets" ||
              row === "totalLiabilitiesAndEquity" ||
              row === "cashFromOperations" ||
              row === "netCashChange" ||
              row === "cash";

            return (
              <tr
                key={row}
                className={`${rowIndex % 2 === 0 ? "bg-paper" : "bg-white"} ${
                  emphasized ? "font-bold text-ink" : ""
                }`}
              >
                <th
                  scope="row"
                  className={`sticky left-0 z-10 border-t border-grid px-4 py-3 text-left ${
                    rowIndex % 2 === 0 ? "bg-paper" : "bg-white"
                  }`}
                >
                  {t(`row.${row}`)}
                </th>
                {periods.map((period) => {
                  const value = period[row];
                  return (
                    <td
                      key={period.label}
                      className={`border-t border-grid px-3 py-3 text-right font-mono tabular-nums ${
                        typeof value === "number" && value < 0 ? "text-red-pen" : ""
                      }`}
                    >
                      {typeof value === "number" ? fmt(value) : value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ThreeStatementForecaster() {
  const t = useTranslations("ThreeStatementTool");
  const format = useFormatter();
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [horizon, setHorizon] = useState<Horizon>("12m");
  const [customPeriods, setCustomPeriods] = useState(18);
  const [statement, setStatement] = useState<Statement>("pnl");

  const periods = useMemo(
    () => calculateThreeStatementForecast(inputs),
    [inputs],
  );
  const lastPeriod = periods.at(-1)!;
  const openingEquity =
    inputs.cash +
    inputs.receivables +
    inputs.otherCurrentAssets +
    inputs.fixedAssets -
    inputs.payables -
    inputs.otherCurrentLiabilities -
    inputs.debt;
  const fmt = (value: number) =>
    format.number(Math.round(value), { maximumFractionDigits: 0 });
  const margin = lastPeriod.revenue
    ? lastPeriod.ebitda / lastPeriod.revenue
    : 0;
  const maxChartValue = Math.max(
    1,
    ...periods.flatMap((period) => [
      Math.abs(period.revenue),
      Math.abs(period.cash),
    ]),
  );
  const chartWidth = Math.max(720, periods.length * 52);
  const point = (value: number, index: number) => {
    const x = 30 + (index / Math.max(1, periods.length - 1)) * (chartWidth - 60);
    const y = 220 - (value / maxChartValue) * 180;
    return `${x.toFixed(1)},${Math.max(20, Math.min(230, y)).toFixed(1)}`;
  };

  const setHorizonPreset = (next: Horizon) => {
    setHorizon(next);
    if (next === "12m") {
      setInputs((current) => ({ ...current, frequency: "monthly", periods: 12 }));
    } else if (next === "24m") {
      setInputs((current) => ({ ...current, frequency: "monthly", periods: 24 }));
    } else if (next === "3y") {
      setInputs((current) => ({ ...current, frequency: "annual", periods: 3 }));
    } else {
      setInputs((current) => ({
        ...current,
        frequency: "monthly",
        periods: customPeriods,
      }));
    }
  };

  const updateInput = (field: NumericKey, value: number) => {
    setInputs((current) => {
      const nextValue = Math.max(0, value);
      if (field === "directCosts") {
        return {
          ...current,
          directCosts: nextValue,
          grossMargin: current.revenue
            ? Math.max(0, 1 - nextValue / current.revenue)
            : current.grossMargin,
        };
      }
      if (field === "revenue") {
        return {
          ...current,
          revenue: nextValue,
          grossMargin: nextValue
            ? Math.max(0, 1 - current.directCosts / nextValue)
            : current.grossMargin,
        };
      }
      return { ...current, [field]: nextValue };
    });
  };

  const statementRows =
    statement === "pnl"
      ? PNL_ROWS
      : statement === "balance"
        ? BALANCE_ROWS
        : CASH_FLOW_ROWS;

  const exportWorkbook = () => {
    const headers = [t("lineItem"), ...periods.map((period) => period.label)];
    const rowsFor = (rows: readonly (keyof ForecastPeriod)[]) =>
      rows.map((row) => [
        t(`row.${row}`),
        ...periods.map((period) => Number(period[row])),
      ]);

    downloadXlsxWorkbook("manic-three-statement-forecast.xlsx", [
      {
        name: t("sheet.assumptions"),
        rows: [
          [t("assumption"), t("value")],
          ...INPUT_GROUPS.flatMap((group) =>
            group.fields.map((field) => [
              t(`field.${field}`),
              PERCENT_FIELDS.has(field) ? inputs[field] * 100 : inputs[field],
            ]),
          ),
          [t("frequency"), t(`frequencyValue.${inputs.frequency}`)],
          [t("periodCount"), inputs.periods],
          [t("openingEquity"), openingEquity],
        ],
      },
      {
        name: t("sheet.pnl"),
        rows: [headers, ...rowsFor(PNL_ROWS)],
      },
      {
        name: t("sheet.balance"),
        rows: [headers, ...rowsFor(BALANCE_ROWS)],
      },
      {
        name: t("sheet.cashFlow"),
        rows: [headers, ...rowsFor(CASH_FLOW_ROWS)],
      },
    ]);
  };

  return (
    <div className="free-tool flex flex-col gap-8">
      <div className="card overflow-hidden">
        <div className="border-b-2 border-ink bg-ink px-5 py-5 text-paper sm:px-7">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="mb-1 text-[11px] font-bold tracking-[0.8px] text-marker">
                {t("setupOverline")}
              </div>
              <h2 className="font-display text-2xl font-bold">{t("setupTitle")}</h2>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label={t("horizonLabel")}>
              {(["12m", "24m", "3y", "custom"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={horizon === item}
                  onClick={() => setHorizonPreset(item)}
                  className={`min-h-11 rounded-[9px] border px-3 py-2 text-xs font-bold transition-colors ${
                    horizon === item
                      ? "border-marker bg-marker text-ink"
                      : "border-paper/40 text-paper hover:border-paper"
                  }`}
                >
                  {t(`horizon.${item}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {horizon === "custom" && (
          <div className="border-b-2 border-ink bg-marker px-5 py-4 sm:px-7">
            <label className="flex max-w-sm items-center gap-4">
              <span className="text-sm font-bold text-ink">{t("customMonths")}</span>
              <input
                type="number"
                min={3}
                max={60}
                value={customPeriods}
                onChange={(event) => {
                  const value = Math.min(60, Math.max(3, Number(event.target.value)));
                  setCustomPeriods(value);
                  setInputs((current) => ({
                    ...current,
                    frequency: "monthly",
                    periods: value,
                  }));
                }}
                className="field max-w-28 font-mono tabular-nums"
              />
            </label>
          </div>
        )}

        <div className="grid gap-8 p-[clamp(20px,4vw,32px)] lg:grid-cols-3">
          {INPUT_GROUPS.map((group) => (
            <section key={group.title}>
              <h3 className="mb-1 font-display text-lg font-bold text-ink">
                {t(group.title)}
              </h3>
              <p className="mb-5 text-xs leading-relaxed font-semibold text-body">
                {t(group.note)}
              </p>
              <div className="flex flex-col gap-4">
                {group.fields.map((field) => (
                  <NumberField
                    key={field}
                    field={field}
                    value={inputs[field]}
                    onChange={(value) => updateInput(field, value)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="border-t-2 border-ink bg-ledger-tint px-5 py-4 sm:px-7">
          <p className="text-sm leading-relaxed font-semibold text-ink">
            {t("serviceNote")}
          </p>
        </div>
      </div>

      <section aria-labelledby="forecast-results">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="overline mb-2">{t("resultsOverline")}</div>
            <h2 id="forecast-results" className="font-display text-3xl font-bold text-ink">
              {t("resultsTitle")}
            </h2>
          </div>
          <button type="button" onClick={exportWorkbook} className="btn-marker">
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            {t("download")}
          </button>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["endingCash", lastPeriod.cash],
            ["endingRevenue", lastPeriod.revenue],
            ["ebitdaMargin", margin],
            ["endingDebt", lastPeriod.debt],
          ].map(([label, value]) => (
            <div key={label} className="card p-5">
              <div className="mb-2 text-[10px] font-bold tracking-[0.65px] text-ledger">
                {t(`metric.${label}`)}
              </div>
              <div
                className={`font-mono text-2xl font-bold tabular-nums ${
                  Number(value) < 0 ? "text-red-pen" : "text-ink"
                }`}
              >
                {label === "ebitdaMargin"
                  ? format.number(Number(value), {
                      style: "percent",
                      maximumFractionDigits: 1,
                    })
                  : fmt(Number(value))}
              </div>
            </div>
          ))}
        </div>

        <div className="card mb-6 overflow-hidden p-5 sm:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl font-bold text-ink">{t("chartTitle")}</h3>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-ink">
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-ledger" />
                {t("revenue")}
              </span>
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-marker border border-ink" />
                {t("endingCash")}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} 250`}
              width={chartWidth}
              height="250"
              role="img"
              aria-label={t("chartLabel")}
              className="min-w-full rounded-[9px] bg-paper"
            >
              {[40, 100, 160, 220].map((y) => (
                <line
                  key={y}
                  x1="20"
                  y1={y}
                  x2={chartWidth - 20}
                  y2={y}
                  stroke="var(--color-grid)"
                  strokeWidth="1"
                />
              ))}
              <polyline
                points={periods.map((period, index) => point(period.revenue, index)).join(" ")}
                fill="none"
                stroke="var(--color-ledger)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={periods.map((period, index) => point(period.cash, index)).join(" ")}
                fill="none"
                stroke="var(--color-marker-dark)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {periods.map((period, index) => {
                const [x] = point(period.revenue, index).split(",");
                return (
                  <text
                    key={period.label}
                    x={x}
                    y="244"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="var(--color-body)"
                  >
                    {period.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label={t("statementLabel")}>
          {(["pnl", "balance", "cashFlow"] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={statement === item}
              onClick={() => setStatement(item)}
              className={`min-h-11 rounded-[9px] border-2 border-ink px-4 py-2 text-sm font-bold transition-colors ${
                statement === item
                  ? "bg-ink text-paper"
                  : "bg-white text-ink hover:bg-ledger-tint"
              }`}
            >
              {t(`statement.${item}`)}
            </button>
          ))}
        </div>

        <ForecastTable periods={periods} rows={statementRows} />
        <p className="mt-4 text-xs leading-relaxed font-semibold text-body">
          {t("privacyNote")}
        </p>
      </section>
    </div>
  );
}
