import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogoMark, Wordmark } from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { site } from "@/lib/site";

const siteName = site.name;

const links = [
  { href: "/#services", label: "services" },
  { href: "/#cashflow", label: "tool" },
  { href: "/#process", label: "process" },
  { href: "/#about", label: "about" },
] as const;

export default function Header() {
  const t = useTranslations("Navigation");

  return (
    <header className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-4 px-5 py-5 sm:px-8">
      <Link href="/" className="flex min-h-11 items-center gap-3" aria-label={t("home", { name: siteName })}>
        <LogoMark />
        <Wordmark />
      </Link>
      <nav aria-label={t("primary")} className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:ml-auto">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex min-h-11 items-center px-1 text-sm font-bold text-ink hover:text-ledger"
          >
            {t(l.label)}
          </Link>
        ))}
        <Link
          href="/contact"
          className="rounded-[10px] border-2 border-ink bg-marker px-5 py-3 text-[15px] font-bold text-ink shadow-hard-sm transition-colors hover:bg-marker-dark"
        >
          {t("bookCall")}
        </Link>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
