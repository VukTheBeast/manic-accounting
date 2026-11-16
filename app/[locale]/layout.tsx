import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/lib/site";
import "../globals.css";

const display = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
});
const sans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-plex-sans",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  variable: "--font-plex-mono",
});

const openGraphLocales: Record<Locale, string> = {
  en: "en_GB",
  cs: "cs_CZ",
  sr: "sr_RS",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Metadata" });
  const languageAlternates = Object.fromEntries(
    routing.locales.map((language) => [language, `/${language}`]),
  );

  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: `%s · ${site.name}` },
    description: t("description"),
    applicationName: site.name,
    keywords: t("keywords").split("|"),
    creator: site.name,
    category: "finance",
    alternates: {
      canonical: `/${locale}`,
      languages: languageAlternates,
    },
    openGraph: {
      type: "website",
      locale: openGraphLocales[locale],
      alternateLocale: routing.locales
        .filter((language) => language !== locale)
        .map((language) => openGraphLocales[language]),
      url: `/${locale}`,
      siteName: site.name,
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B6B4F",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = (await import(`../../messages/${locale}.json`)).default;
  const navigation = await getTranslations({ locale, namespace: "Navigation" });

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          {navigation("skip")}
        </a>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
