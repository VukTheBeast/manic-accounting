import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const homeLanguages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${site.url}/${locale}`]),
  );
  const contactLanguages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${site.url}/${locale}/contact`]),
  );
  const toolsLanguages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${site.url}/${locale}/tools`]),
  );
  const forecastLanguages = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      `${site.url}/${locale}/tools/three-statement-forecast`,
    ]),
  );
  const debtCapacityLanguages = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      `${site.url}/${locale}/tools/debt-repayment-capacity`,
    ]),
  );

  return routing.locales.flatMap((locale) => [
    {
      url: `${site.url}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    {
      url: `${site.url}/${locale}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
      alternates: { languages: contactLanguages },
    },
    {
      url: `${site.url}/${locale}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
      alternates: { languages: toolsLanguages },
    },
    {
      url: `${site.url}/${locale}/tools/three-statement-forecast`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
      alternates: { languages: forecastLanguages },
    },
    {
      url: `${site.url}/${locale}/tools/debt-repayment-capacity`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
      alternates: { languages: debtCapacityLanguages },
    },
  ]);
}
