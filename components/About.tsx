import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const FACTS = [
  ["factExperience", "factExperienceValue"],
  ["factEducation", "factEducationValue"],
  ["factInternational", "factInternationalValue"],
  ["factAcca", "factAccaValue"],
  ["factApproach", "factApproachValue"],
] as const;

export default function About() {
  const t = useTranslations("About");

  return (
    <section id="about" className="section-shell flex scroll-mt-4 flex-wrap items-center gap-x-16 gap-y-12">
      <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5">
        <div className="overline">{t("overline")}</div>
        <h2 className="h2">{t("title")}</h2>
        <p className="text-[17px] leading-[1.7]">{t("paragraphOne")}</p>
        <p className="text-[17px] leading-[1.7]">{t("paragraphTwo")}</p>
        <p className="text-[17px] leading-[1.7]">{t("paragraphThree")}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="btn-marker">{t("button")}</Link>
          <a
            href="https://www.linkedin.com/in/vukman-manic-17586145/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost gap-2"
          >
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
              <path d="M7 9v8M7 6.5v.01M11 17v-4.5a3.5 3.5 0 0 1 7 0V17M11 9v8" />
              <rect x="3" y="3" width="18" height="18" rx="3" />
            </svg>
            {t("linkedin")}
          </a>
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
        <div className="card flex flex-col gap-3.5 border-ink bg-ink p-6 text-paper/75">
          <div className="text-[11px] font-bold tracking-[1.2px] text-marker uppercase">{t("shortVersion")}</div>
          {FACTS.map(([k, v], i) => (
            <div
              key={k}
              className={`flex justify-between gap-4 text-[15px] ${i < FACTS.length - 1 ? "border-b border-paper/20 pb-3" : ""}`}
            >
              <span>{t(k)}</span>
              <strong className="text-right text-paper">{t(v)}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
