"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { LogoMark, Wordmark } from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { site } from "@/lib/site";

const siteName = site.name;

const links = [
  { href: "/#services", label: "services", section: "services" },
  { href: "/#cashflow", label: "tool", section: "cashflow" },
  { href: "/#process", label: "process", section: "process" },
  { href: "/#about", label: "about", section: "about" },
] as const;

export default function Header() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sections = links
      .map(({ section }) => document.getElementById(section))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        } else {
          setActiveSection(null);
        }
      },
      {
        rootMargin: "-24% 0px -64% 0px",
        threshold: [0, 0.1, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 sm:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-3" aria-label={t("home", { name: siteName })}>
          <LogoMark />
          <span className="hidden sm:block">
            <Wordmark />
          </span>
        </Link>

        <nav
          aria-label={t("primary")}
          className="ml-auto hidden items-center gap-1 xl:flex"
        >
          {links.map((link) => {
            const active = pathname === "/" && activeSection === link.section;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "location" : undefined}
                onClick={() => setActiveSection(link.section)}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-md px-3 text-sm font-bold transition-colors ${
                  active
                    ? "bg-ledger-tint text-ledger"
                    : "text-ink hover:bg-ledger-tint hover:text-ledger"
                }`}
              >
                {t(link.label)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-2">
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className={`hidden rounded-[10px] border-2 border-ink px-5 py-3 text-[15px] font-bold shadow-hard-sm transition-colors xl:inline-flex ${
              pathname === "/contact"
                ? "bg-ledger text-white"
                : "bg-marker text-ink hover:bg-marker-dark"
            }`}
          >
            {t("bookCall")}
          </Link>
          <LanguageSwitcher />
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex size-11 items-center justify-center rounded-[10px] border-2 border-ink bg-white text-ink transition-colors hover:bg-ledger-tint xl:hidden"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <>
                  <path d="M5 5l14 14" />
                  <path d="M19 5L5 19" />
                </>
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <nav
            id="mobile-navigation"
            aria-label={t("primary")}
            className="mobile-menu grid w-full grid-cols-2 gap-2 border-t-2 border-ink pt-3 xl:hidden"
          >
            {links.map((link) => {
              const active = pathname === "/" && activeSection === link.section;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "location" : undefined}
                  onClick={() => {
                    setActiveSection(link.section);
                    setMobileOpen(false);
                  }}
                  className={`flex min-h-12 items-center justify-center rounded-[10px] px-3 text-center text-sm font-bold transition-colors ${
                    active
                      ? "bg-ledger text-white"
                      : "border-2 border-ink bg-white text-ink hover:bg-ledger-tint"
                  }`}
                >
                  {t(link.label)}
                </Link>
              );
            })}
            <Link
              href="/contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
              className={`col-span-2 flex min-h-12 items-center justify-center rounded-[10px] border-2 border-ink px-4 text-center text-sm font-bold shadow-hard-sm ${
                pathname === "/contact"
                  ? "bg-ledger text-white"
                  : "bg-marker text-ink hover:bg-marker-dark"
              }`}
            >
              {t("bookCall")}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
