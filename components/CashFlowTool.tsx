"use client";

import { useState } from "react";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type Key = "opening" | "cin" | "cout" | "oneoff";

const SLIDERS: { key: Key; id: string; label: string; max: number }[] = [
  { key: "opening", id: "sl-open", label: "Cash in the bank today", max: 60000 },
  { key: "cin", id: "sl-in", label: "Cash in per week (customer payments)", max: 30000 },
  { key: "cout", id: "sl-out", label: "Cash out per week (salaries, suppliers, rent)", max: 30000 },
  { key: "oneoff", id: "sl-one", label: "One-off payment in week 8 (VAT, tax, equipment)", max: 50000 },
];

const WEEKS = 13;
const CHART_H = 240;
const PAD = 12;

/** Mini 13-week cash flow forecast. */
export default function CashFlowTool() {
  const [v, setV] = useState<Record<Key, number>>({
    opening: 20000,
    cin: 10000,
    cout: 9500,
    oneoff: 25000,
  });

  // balance per week
  const balances: number[] = [];
  let bal = v.opening;
  for (let w = 1; w <= WEEKS; w++) {
    bal += v.cin - v.cout - (w === 8 ? v.oneoff : 0);
    balances.push(bal);
  }

  const minV = Math.min(0, ...balances);
  const maxV = Math.max(0, ...balances);
  const range = maxV - minV || 1;
  const usable = CHART_H - 2 * PAD;
  const zeroY = PAD + (maxV / range) * usable;

  const lowest = Math.min(...balances);
  const lowWeek = balances.indexOf(lowest) + 1;
  const firstNeg = balances.findIndex((b) => b < 0) + 1;

  const negative = firstNeg > 0;
  const verdict = negative
    ? `Cash goes negative in week ${firstNeg} (lowest point: ${fmt(lowest)}). That is a conversation for week 1, not a surprise in week ${firstNeg}.`
    : `Cash stays positive for all 13 weeks. Lowest point: ${fmt(lowest)} in week ${lowWeek}.`;

  return (
    <div className="card flex flex-wrap gap-x-10 gap-y-8 p-[clamp(20px,4vw,32px)]">
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-6">
        {SLIDERS.map((s) => (
          <div key={s.key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor={s.id} className="text-[12.5px] font-bold text-ink">
                {s.label}
              </label>
              <span className="font-mono text-[17px] font-semibold text-ink tabular-nums">
                {fmt(v[s.key])}
              </span>
            </div>
            <input
              id={s.id}
              type="range"
              min={0}
              max={s.max}
              step={500}
              value={v[s.key]}
              onChange={(e) => setV((p) => ({ ...p, [s.key]: Number(e.target.value) }))}
              className="h-7 w-full accent-ledger"
            />
          </div>
        ))}
      </div>

      <div className="flex min-w-0 flex-[2_1_480px] flex-col gap-4">
        <div className="text-xs font-bold tracking-[0.6px] text-ink">BANK BALANCE, WEEK BY WEEK</div>
        <div
          role="img"
          aria-label={`Bar chart of the projected bank balance over 13 weeks. ${verdict}`}
          className="relative overflow-hidden rounded-[10px] bg-paper"
          style={{ height: CHART_H }}
        >
          {balances.map((b, i) => {
            const h = Math.max((Math.abs(b) / range) * usable, 2);
            return (
              <div
                key={i}
                className={`absolute rounded ${b >= 0 ? "bg-ledger" : "bg-red-pen"}`}
                style={{
                  left: `${((i * 100) / WEEKS + 0.9).toFixed(2)}%`,
                  width: `${(100 / WEEKS - 1.8).toFixed(2)}%`,
                  top: b >= 0 ? zeroY - h : zeroY,
                  height: h,
                }}
              />
            );
          })}
          <div
            className="absolute right-0 left-0 border-t-[1.5px] border-dashed border-ink"
            style={{ top: zeroY }}
          />
        </div>
        <div className="flex text-[11px] font-bold">
          {balances.map((_, i) => (
            <span key={i} className="flex-1 text-center">
              {i + 1}
            </span>
          ))}
        </div>
        <p className="text-xs font-semibold">
          Week · dashed line = zero cash · green above, red below
        </p>
        <div
          className={`rounded-[10px] p-4 text-[15px] leading-normal font-bold ${
            negative ? "bg-red-tint text-red-pen" : "bg-ledger-tint text-ledger"
          }`}
        >
          {verdict}
        </div>
      </div>
    </div>
  );
}
