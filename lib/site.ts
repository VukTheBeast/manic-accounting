const vercelHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelHost ? `https://${vercelHost}` : undefined);

const siteUrl = (() => {
  try {
    return new URL(configuredUrl ?? "http://localhost:3000").origin;
  } catch {
    return "http://localhost:3000";
  }
})();

export const site = {
  name: "Manic Accounting",
  tagline: "Manic about your numbers. Calm about your books.",
  description:
    "Bookkeeping, month-end close, budgets, 13-week cash flow and VAT preparation for small businesses and freelancers.",
  url: siteUrl,
  legal: process.env.NEXT_PUBLIC_LEGAL_TEXT ?? "",
  locale: "en_GB",
  keywords: [
    "accounting for small businesses",
    "freelance accountant",
    "bookkeeping services",
    "month-end close",
    "13-week cash flow forecast",
    "budgeting and forecasting",
    "VAT preparation",
    "management reporting",
    "free financial tools",
    "break-even calculator",
    "small business cash flow tools",
  ],
} as const;
