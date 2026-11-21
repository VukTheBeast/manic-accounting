"use client";

import Image from "next/image";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";

const PROFIT = 186_400;
const CASH_BARS = [42, 48, 55, 62, 66, 58, 46, 36, 31, 39, 49, 58, 71];

type Props = {
  portraitAlt: string;
  profileRole: string;
  sample: string;
  profitLabel: string;
  cashLabel: string;
  healthy: string;
  lowPoint: string;
  weekEight: string;
  buffer: string;
  nineWeeks: string;
};

export default function HeroFinanceVisual({
  portraitAlt,
  profileRole,
  sample,
  profitLabel,
  cashLabel,
  healthy,
  lowPoint,
  weekEight,
  buffer,
  nineWeeks,
}: Props) {
  const format = useFormatter();
  const [profit, setProfit] = useState(0);
  const [trendCycle, setTrendCycle] = useState(0);
  const [activeWeek, setActiveWeek] = useState(-1);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    if (reducedMotion.matches) {
      frame = window.requestAnimationFrame(() => setProfit(PROFIT));
      return () => window.cancelAnimationFrame(frame);
    }

    const startedAt = performance.now();

    const count = (now: number) => {
      const progress = Math.min((now - startedAt) / 1900, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setProfit(Math.round(PROFIT * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(count);
      }
    };

    frame = window.requestAnimationFrame(count);
    const trendTimer = window.setInterval(
      () => setTrendCycle((cycle) => cycle + 1),
      6500,
    );

    let step = -3;
    const markerTimer = window.setInterval(() => {
      step = step >= 16 ? 0 : step + 1;
      setActiveWeek(step <= 12 ? step : -1);
    }, 520);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(trendTimer);
      window.clearInterval(markerTimer);
    };
  }, []);

  return (
    <div className="relative min-h-[570px] min-w-0 self-end sm:min-h-[640px] lg:h-full lg:min-h-[650px]">
      <div className="absolute inset-x-[12%] top-[8%] bottom-0 rounded-t-[22px] border border-paper/15 bg-[#12315b]" />
      <Image
        src="/manic-vukman-hero.png"
        alt={portraitAlt}
        fill
        priority
        sizes="(min-width: 1024px) 46vw, 90vw"
        className="z-[1] object-contain object-bottom"
      />

      <div className="hero-float-profit absolute bottom-[20%] left-0 z-[2] w-[48%] min-w-[190px] rounded-[12px] border border-[#42638e] bg-ink/94 p-4 shadow-[0_16px_34px_rgba(0,0,0,0.22)] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 font-mono text-[10px] font-bold tracking-[0.8px] text-marker-light uppercase">
          <span>{profitLabel}</span>
          <span className="text-paper/70">{sample}</span>
        </div>
        <div className="mt-3 flex items-end gap-3">
          <strong className="font-display text-[clamp(24px,5vw,34px)] leading-none text-paper tabular-nums">
            {format.number(profit, { maximumFractionDigits: 0 })}
          </strong>
          <span className="font-mono text-xs font-bold text-marker-light">+18%</span>
        </div>
        <svg
          viewBox="0 0 220 54"
          className="mt-3 hidden h-12 w-full overflow-visible sm:block"
          aria-hidden="true"
        >
          <path
            d="M2 48C26 46 32 39 52 41S80 30 101 33s31-18 50-13 34-13 67-17"
            fill="none"
            stroke="color-mix(in srgb, var(--color-marker) 28%, transparent)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            key={trendCycle}
            d="M2 48C26 46 32 39 52 41S80 30 101 33s31-18 50-13 34-13 67-17"
            fill="none"
            stroke="var(--color-marker-light)"
            strokeWidth="3"
            strokeLinecap="round"
            className="hero-trend-line"
          />
        </svg>
      </div>

      <div className="hero-float-cash absolute right-0 bottom-[16%] z-[3] w-[55%] min-w-[220px] rounded-[12px] border border-[#42638e] bg-ink/96 p-4 shadow-[0_16px_34px_rgba(0,0,0,0.25)] backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-bold tracking-[0.8px] text-marker-light uppercase">
            {cashLabel}
          </span>
          <span className="rounded-md bg-marker px-2 py-1 text-[10px] font-bold text-ink">
            {healthy}
          </span>
        </div>
        <div className="flex h-16 items-end gap-1" aria-hidden="true">
          {CASH_BARS.map((height, index) => (
            <span
              key={index}
              className={`hero-cash-bar relative flex-1 rounded-t-[2px] bg-marker ${
                activeWeek === index ? "bg-marker-light" : ""
              }`}
              style={{
                height: `${height}%`,
                animationDelay: `${index * 85}ms`,
              }}
            >
              {activeWeek === index && (
                <span className="absolute -top-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-paper shadow-[0_0_8px_var(--color-marker-light)]" />
              )}
            </span>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-paper/70">
          <span
            className={`rounded-md border p-2 transition-[background-color,border-color,color] duration-300 ${
              activeWeek === 7
                ? "border-marker-light bg-marker/15 text-paper"
                : "border-paper/18"
            }`}
          >
            {lowPoint}
            <strong className="block text-paper">{weekEight}</strong>
          </span>
          <span className="rounded-md border border-paper/18 p-2">
            {buffer}
            <strong className="block text-paper">{nineWeeks}</strong>
          </span>
        </div>
      </div>

      <div className="absolute right-[8%] bottom-[3%] left-[8%] z-[4] rounded-[12px] border border-[#42638e] bg-ink/95 px-5 py-3 text-center shadow-[0_12px_28px_rgba(0,0,0,0.22)]">
        <strong className="font-display text-base text-paper">Vukman Manić</strong>
        <span className="mt-1 block text-xs text-paper/70">{profileRole}</span>
      </div>
    </div>
  );
}
