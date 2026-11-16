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
    <section id="process" className="scroll-mt-4 bg-ink text-paper/80">
      <div className="mx-auto max-w-[1200px] px-5 pt-22 pb-24 sm:px-8">
        <div className="mb-3 text-xs font-bold tracking-[0.6px] text-marker">{t("overline")}</div>
        <h2 className="mb-12 max-w-[720px] font-display text-[clamp(32px,7.5vw,46px)] leading-[1.08] font-bold text-paper">
          {t("title")}
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-8">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col gap-2.5">
              <div className="font-display text-[56px] leading-none font-bold text-marker">{s.n}</div>
              <h3 className="text-xl font-bold text-paper">{t(s.title)}</h3>
              <p className="text-[15px] leading-relaxed">{t(s.text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
