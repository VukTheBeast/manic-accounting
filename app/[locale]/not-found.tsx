import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  const t = useTranslations("Errors");

  return (
    <div className="ledger-paper min-h-screen">
      <Header />
      <main id="main-content" className="mx-auto flex max-w-[1200px] flex-col items-start gap-5 px-5 py-20 sm:px-8">
        <div className="overline">{t("notFoundOverline")}</div>
        <h1 className="h2">{t("notFoundTitle")}</h1>
        <p className="max-w-[580px] text-[17px] leading-relaxed">{t("notFoundText")}</p>
        <Link href="/" className="btn-marker">{t("home")}</Link>
      </main>
      <Footer />
    </div>
  );
}
