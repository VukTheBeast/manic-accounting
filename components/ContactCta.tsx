import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ContactCta() {
  const t = useTranslations("ContactCta");

  return (
    <section className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-8 lg:pb-28">
      <div className="flex flex-wrap items-center gap-x-12 gap-y-7 rounded-card border-2 border-ink bg-ink p-[clamp(28px,5vw,52px)] text-paper shadow-[0_16px_40px_rgba(11,36,71,0.16)]">
        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3">
          <h2 className="font-display text-[clamp(30px,6vw,46px)] leading-[1.08] font-bold tracking-[-0.025em] text-paper">
            {t("title")}
          </h2>
          <p className="max-w-[680px] text-[17px] leading-relaxed text-paper/75">
            {t("text")}
          </p>
        </div>
        <div className="flex items-start">
          <Link href="/contact" className="btn-marker">{t("button")}</Link>
        </div>
      </div>
    </section>
  );
}
