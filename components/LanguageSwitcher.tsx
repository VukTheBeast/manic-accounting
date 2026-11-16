"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

function Flag({ locale }: { locale: Locale }) {
  if (locale === "cs") {
    return (
      <svg viewBox="0 0 30 20" aria-hidden="true" className="h-4 w-6 rounded-[2px]">
        <path fill="#fff" d="M0 0h30v10H0z" />
        <path fill="#d7141a" d="M0 10h30v10H0z" />
        <path fill="#11457e" d="M0 0l13 10L0 20z" />
      </svg>
    );
  }

  if (locale === "sr") {
    return (
      <svg viewBox="0 0 30 20" aria-hidden="true" className="h-4 w-6 rounded-[2px]">
        <path fill="#c6363c" d="M0 0h30v6.67H0z" />
        <path fill="#0c4076" d="M0 6.67h30v6.66H0z" />
        <path fill="#fff" d="M0 13.33h30V20H0z" />
        <path fill="#fff" d="M5 4.5h4v8H5z" opacity=".9" />
        <path fill="#c6363c" d="M5.7 5.2h2.6v6.6H5.7z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 30 20" aria-hidden="true" className="h-4 w-6 rounded-[2px]">
      <path fill="#012169" d="M0 0h30v20H0z" />
      <path stroke="#fff" strokeWidth="4" d="M0 0l30 20M30 0L0 20" />
      <path stroke="#c8102e" strokeWidth="2" d="M0 0l30 20M30 0L0 20" />
      <path stroke="#fff" strokeWidth="7" d="M15 0v20M0 10h30" />
      <path stroke="#c8102e" strokeWidth="4" d="M15 0v20M0 10h30" />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Languages");
  const navigation = useTranslations("Navigation");
  const [pending, startTransition] = useTransition();

  return (
    <div
      className="flex items-center gap-1 rounded-[10px] border-2 border-ink bg-white p-1"
      aria-label={navigation("language")}
      role="group"
    >
      {routing.locales.map((nextLocale) => {
        const active = locale === nextLocale;
        return (
          <button
            key={nextLocale}
            type="button"
            aria-label={t(nextLocale)}
            aria-pressed={active}
            title={t(nextLocale)}
            disabled={pending}
            onClick={() => {
              startTransition(() => {
                router.replace(pathname, { locale: nextLocale });
              });
            }}
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 transition-colors ${
              active ? "bg-ledger-tint" : "hover:bg-paper"
            }`}
          >
            <Flag locale={nextLocale} />
          </button>
        );
      })}
    </div>
  );
}
