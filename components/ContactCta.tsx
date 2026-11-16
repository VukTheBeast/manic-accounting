import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ContactCta() {
  const t = useTranslations("ContactCta");

  return (
    <section className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-8">
      <div className="flex flex-wrap items-center gap-x-12 gap-y-7 rounded-card border-2 border-ink bg-marker p-[clamp(24px,5vw,48px)] shadow-hard">
        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3">
          <h2 className="font-display text-[clamp(30px,6vw,44px)] leading-[1.1] font-bold text-ink">
            {t("title")}
          </h2>
          <p className="text-[17px] leading-relaxed text-ink">
            {t("text")}
          </p>
        </div>
        <div className="flex items-start">
          <Link href="/contact" className="btn-dark">{t("button")}</Link>
        </div>
      </div>
    </section>
  );
}
