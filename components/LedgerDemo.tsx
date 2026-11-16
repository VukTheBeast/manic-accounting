"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

type Entry = { title: string; meta: string; dr: number; cr: number };

/** Hero demo: post journal entries and make the ledger balance. */
export default function LedgerDemo() {
  const t = useTranslations("Ledger");
  const format = useFormatter();
  const fmt = (number: number) =>
    format.number(Math.round(number), { maximumFractionDigits: 0 });
  const [posted, setPosted] = useState([false, false, false]);
  const [fixed, setFixed] = useState(false);

  const entries: Entry[] = [
    { title: t("invoiceTitle"), meta: t("invoiceMeta"), dr: 4800, cr: 4800 },
    { title: t("rentTitle"), meta: t("rentMeta"), dr: 1200, cr: 1200 },
    {
      title: t("laptopTitle"),
      meta: fixed ? t("laptopFixedMeta") : t("laptopMeta"),
      dr: 2500,
      cr: fixed ? 2500 : 2000,
    },
  ];

  const debit = entries.reduce((sum, e, i) => sum + (posted[i] ? e.dr : 0), 0);
  const credit = entries.reduce((sum, e, i) => sum + (posted[i] ? e.cr : 0), 0);
  const diff = debit - credit;
  const any = posted.some(Boolean);
  const allPosted = posted.every(Boolean);
  const canFix = any && diff !== 0 && !fixed;

  const status = !any
    ? { label: t("nothing"), cls: "bg-[#ecefe6] text-body" }
    : diff === 0
      ? { label: t("balanced"), cls: "bg-ledger-tint text-ledger" }
      : { label: t("offBy", { amount: fmt(Math.abs(diff)) }), cls: "bg-red-tint text-red-pen" };

  const toggle = (i: number) =>
    setPosted((p) => p.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className="relative">
      {allPosted && diff === 0 && (
        <div className="absolute top-[-22px] right-2 z-10 -rotate-[8deg] rounded-[10px] border-[3px] border-ledger bg-white px-3.5 py-1 font-display text-[22px] font-bold tracking-wide text-ledger">
          {t("balancedStamp")}
        </div>
      )}
      <div className="card flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-bold tracking-[0.6px] text-ink">{t("title")}</div>
          <div className={`rounded-md px-3 py-1.5 text-[12.5px] font-bold ${status.cls}`}>
            {status.label}
          </div>
        </div>
        <p className="text-sm leading-normal">
          {t("intro")}
        </p>

        <div className="flex flex-col gap-2.5">
          {entries.map((e, i) => {
            const on = posted[i];
            return (
              <button
                key={e.title}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(i)}
                className={`flex w-full items-center gap-3.5 rounded-[10px] p-3.5 text-left transition-colors hover:border-ink ${
                  on ? "border-2 border-ink bg-white" : "border-[1.5px] border-dashed border-[#9aa39c] bg-paper"
                }`}
              >
                {on ? (
                  <span className="flex size-[26px] flex-none items-center justify-center rounded-full bg-ink">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                ) : (
                  <span className="size-[26px] flex-none rounded-full border-[1.5px] border-dashed border-mute" />
                )}
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[15px] font-bold text-ink">{e.title}</span>
                  <span className="text-xs">{e.meta}</span>
                </span>
                <span className="flex flex-none flex-col items-end gap-0.5 font-mono text-[13px] font-semibold text-ink tabular-nums">
                  <span>Dr {fmt(e.dr)}</span>
                  <span>Cr {fmt(e.cr)}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-[#dde3dc] pt-3.5 font-mono text-sm font-semibold text-ink tabular-nums">
          <span>{t("debits", { amount: fmt(debit) })}</span>
          <span>{t("credits", { amount: fmt(credit) })}</span>
          <span>{t("difference", { amount: fmt(Math.abs(diff)) })}</span>
        </div>

        {canFix && (
          <div className="flex flex-wrap items-center gap-3 rounded-[10px] bg-red-tint p-3.5">
            <p className="min-w-[200px] flex-1 text-sm font-semibold leading-normal text-red-pen">
              {t("short", { amount: fmt(Math.abs(diff)) })}
            </p>
            <button
              type="button"
              onClick={() => setFixed(true)}
              className="min-h-11 rounded-[10px] border-2 border-ink bg-marker px-4 py-3 text-sm font-bold text-ink hover:bg-marker-dark"
            >
              {t("fix")}
            </button>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={() => {
              setPosted([false, false, false]);
              setFixed(false);
            }}
            className="min-h-11 text-xs font-bold text-ledger underline-offset-2 hover:underline"
          >
            {t("reset")}
          </button>
        </div>
      </div>
    </div>
  );
}
