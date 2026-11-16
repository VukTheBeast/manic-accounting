import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const FACTS = [
  ["factFinance", "factFinanceValue"],
  ["factTeams", "factTeamsValue"],
  ["factVat", "factVatValue"],
  ["factAutomation", "factAutomationValue"],
  ["factWorking", "factWorkingValue"],
] as const;

export default function About() {
  const t = useTranslations("About");

  return (
    <section id="about" className="mx-auto flex max-w-[1200px] scroll-mt-4 flex-wrap items-start gap-x-14 gap-y-12 px-5 py-24 sm:px-8">
      <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5">
        <div className="overline">{t("overline")}</div>
        <h2 className="h2">{t("title")}</h2>
        <p className="text-[17px] leading-[1.7]">{t("paragraphOne")}</p>
        <p className="text-[17px] leading-[1.7]">{t("paragraphTwo")}</p>
        <div>
          <Link href="/contact" className="btn-marker">{t("button")}</Link>
        </div>
      </div>

      <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
        <div className="overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard">
          <Image
            src="/vukman-manic-accounting.webp"
            alt={t("photoAlt")}
            width={1200}
            height={800}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="h-auto w-full"
          />
        </div>
        <div className="card flex flex-col gap-3.5 p-6">
          <div className="text-xs font-bold tracking-[0.6px] text-ink">{t("shortVersion")}</div>
          {FACTS.map(([k, v], i) => (
            <div
              key={k}
              className={`flex justify-between gap-4 text-[15px] ${i < FACTS.length - 1 ? "border-b border-mute/25 pb-3" : ""}`}
            >
              <span>{t(k)}</span>
              <strong className="text-right text-ink">{t(v)}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
