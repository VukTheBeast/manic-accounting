import { useTranslations } from "next-intl";

const STEPS = [
  { n: "01", title: "stepOneTitle", text: "stepOneText" },
  { n: "02", title: "stepTwoTitle", text: "stepTwoText" },
  { n: "03", title: "stepThreeTitle", text: "stepThreeText" },
  { n: "04", title: "stepFourTitle", text: "stepFourText" },
] as const;

export default function Process() {
  const t = useTranslations("Process");

  return (
    <section id="process" className="scroll-mt-4 bg-ink text-paper">
      <div className="section-shell">
        <div className="mb-3 text-[11px] font-bold tracking-[1.4px] text-marker uppercase">{t("overline")}</div>
        <h2 className="mb-12 max-w-[720px] font-display text-[clamp(32px,7.5vw,48px)] leading-[1.06] font-bold tracking-[-0.025em] text-paper">
          {t("title")}
        </h2>
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="border-t border-paper/25 pt-5">
              <div className="mb-4 font-mono text-sm font-bold text-marker tabular-nums">{s.n}</div>
              <div>
                <h3 className="mb-2 font-display text-xl font-bold text-paper">{t(s.title)}</h3>
                <p className="text-[15px] leading-[1.7] text-paper/70">{t(s.text)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
