"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const INPUTS = ["invoices", "bank", "payroll"] as const;
const OUTPUTS = ["close", "vat", "forecast"] as const;
const PHASES = ["input", "process", "output"] as const;

function FlowConnector({ active }: { active: boolean }) {
  return (
    <div
      className="relative flex h-14 items-center justify-center md:h-auto md:min-h-20 md:w-16"
      aria-hidden="true"
    >
      <div className="absolute h-full w-px bg-ink/25 md:h-px md:w-full" />
      {[0, 1, 2].map((packet) => (
        <span
          key={packet}
          className={`workflow-packet absolute size-2.5 rounded-[3px] border border-ink bg-marker ${
            active ? "block" : "hidden"
          }`}
          style={{ animationDelay: `${packet * 280}ms` }}
        />
      ))}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute bottom-[-2px] rotate-90 text-ink md:right-[-2px] md:bottom-auto md:rotate-0"
      >
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </svg>
    </div>
  );
}

export default function WorkflowAnimation() {
  const t = useTranslations("Workflow");
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setPhase((current) => (current + 1) % PHASES.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="workflow" className="workflow-section mx-auto max-w-[1200px] scroll-mt-4 px-5 pb-24 sm:px-8">
      <div className="overline mb-3">{t("overline")}</div>
      <h2 className="h2 mb-4 max-w-[760px]">{t("title")}</h2>
      <p className="mb-9 max-w-[700px] text-[17px] leading-relaxed">{t("intro")}</p>

      <div className="card overflow-hidden p-[clamp(18px,4vw,32px)]">
        <div className="mb-7 grid grid-cols-3 gap-2" role="group" aria-label={t("phaseLabel")}>
          {PHASES.map((phaseName, index) => (
            <button
              key={phaseName}
              type="button"
              aria-pressed={phase === index}
              onClick={() => setPhase(index)}
              className={`min-h-11 rounded-[9px] px-2 py-2 text-[11px] font-bold tracking-[0.3px] transition-colors sm:text-sm ${
                phase === index
                  ? "bg-ink text-paper"
                  : "bg-paper text-body hover:bg-ledger-tint hover:text-ledger"
              }`}
            >
              <span className="font-mono tabular-nums">{index + 1}. </span>
              {t(`phase.${phaseName}`)}
            </button>
          ))}
        </div>

        <div className="grid items-stretch md:grid-cols-[1fr_auto_1.15fr_auto_1fr]">
          <div
            className={`flex flex-col gap-3 rounded-[12px] border-2 p-4 transition-[transform,background-color,border-color] duration-500 ${
              phase === 0
                ? "-translate-y-1 border-ledger bg-ledger-tint"
                : "border-ink bg-white"
            }`}
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="text-xs font-bold tracking-[0.5px] text-ink">{t("inputTitle")}</span>
              <span className="rounded-full bg-paper px-2.5 py-1 font-mono text-[11px] font-semibold text-ledger">
                {t("incoming")}
              </span>
            </div>
            {INPUTS.map((input, index) => (
              <div
                key={input}
                className={`flex min-h-14 items-center gap-3 rounded-[9px] border p-3 transition-all duration-500 ${
                  phase === 0
                    ? "border-ink bg-white shadow-hard-sm"
                    : "border-mute/25 bg-paper"
                }`}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <span className="flex size-8 flex-none items-center justify-center rounded-md bg-marker font-mono text-xs font-bold text-ink">
                  {index + 1}
                </span>
                <span className="text-sm font-bold text-ink">{t(`input.${input}`)}</span>
              </div>
            ))}
          </div>

          <FlowConnector active={phase === 0} />

          <div
            className={`relative overflow-hidden rounded-[12px] border-2 p-4 transition-[transform,background-color,border-color] duration-500 ${
              phase === 1
                ? "-translate-y-1 border-ledger bg-ledger-tint"
                : "border-ink bg-white"
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-mute/25 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-pen" />
                <span className="size-2.5 rounded-full bg-marker" />
                <span className="size-2.5 rounded-full bg-ledger" />
              </div>
              <span className="font-mono text-[11px] font-semibold text-ink">{t("workbook")}</span>
            </div>

            <div className="mb-4 grid grid-cols-5 gap-1">
              {Array.from({ length: 25 }, (_, index) => (
                <span
                  key={index}
                  className={`workflow-cell h-5 rounded-[2px] border border-grid ${
                    phase === 1 && index % 4 === 0
                      ? "workflow-cell-active bg-marker"
                      : index % 3 === 0
                        ? "bg-ledger-tint"
                        : "bg-paper"
                  }`}
                  style={{ animationDelay: `${index * 24}ms` }}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(["check", "match", "explain"] as const).map((step, index) => (
                <div
                  key={step}
                  className={`rounded-[8px] px-2 py-2 text-center text-[11px] font-bold transition-colors duration-300 ${
                    phase === 1
                      ? "workflow-process-step bg-ledger text-white"
                      : "bg-paper text-body"
                  }`}
                  style={{ animationDelay: `${index * 180}ms` }}
                >
                  {t(`process.${step}`)}
                </div>
              ))}
            </div>
          </div>

          <FlowConnector active={phase === 1} />

          <div
            className={`flex flex-col gap-3 rounded-[12px] border-2 p-4 transition-[transform,background-color,border-color] duration-500 ${
              phase === 2
                ? "-translate-y-1 border-ledger bg-ledger-tint"
                : "border-ink bg-white"
            }`}
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="text-xs font-bold tracking-[0.5px] text-ink">{t("outputTitle")}</span>
              <span className="rounded-full bg-paper px-2.5 py-1 font-mono text-[11px] font-semibold text-ledger">
                {t("ready")}
              </span>
            </div>
            {OUTPUTS.map((output, index) => (
              <div
                key={output}
                className={`rounded-[9px] border p-3 transition-all duration-500 ${
                  phase === 2
                    ? "border-ink bg-white shadow-hard-sm"
                    : "border-mute/25 bg-paper"
                }`}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-ink">{t(`output.${output}`)}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-ledger"
                    aria-hidden="true"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </div>
                <div className="flex h-2 gap-1">
                  {[72, 48, 88].map((width, bar) => (
                    <span
                      key={bar}
                      className={`h-full flex-1 origin-left rounded-full transition-transform duration-700 ${
                        bar === 1 ? "bg-marker" : "bg-ledger"
                      }`}
                      style={{
                        transform: `scaleX(${phase === 2 ? width / 100 : 0.18})`,
                        transitionDelay: `${index * 90 + bar * 60}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-sm font-semibold text-body">{t("caption")}</p>
      </div>
    </section>
  );
}
