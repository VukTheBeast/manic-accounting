# Project context for GitHub Copilot

Website for **Manić Accounting**, a one-person accounting side business (bookkeeping, month-end close,
budgets and forecasts, 13-week cash flow, VAT and tax preparation) aimed at small businesses and freelancers.

## Stack
- Next.js (App Router, TypeScript), React, Tailwind CSS v4
- No UI library. Components live in `components/`, pages in `app/`.
- Contact form posts to `app/api/contact/route.ts`, which sends mail through the Resend HTTP API.

## Brand and style rules
- Tone: first person, friendly, a little cheeky ("manic about numbers, calm about books"). Never corporate jargon.
- Look: ledger paper. Graph-paper background (`.ledger-paper`), near-black ink, ledger green, yellow highlighter.
- Cards use `.card`: 2px ink border, 14px radius, hard offset shadow, no blur, no gradients.
- Colors and fonts are Tailwind theme tokens in `app/globals.css` (`ink`, `ledger`, `marker`, `paper`, `red-pen`,
  `font-display`, `font-sans`, `font-mono`). Use tokens, do not hardcode new hex values.
- Numbers (money, ledger) use `font-mono tabular-nums`.
- Mobile first. Touch targets at least 44px. Form inputs at least 16px text so iOS does not zoom.
- No emoji. Icons are small inline stroke SVGs (1.9px stroke, round caps).

## Content rules
- Service names and descriptions live only in `lib/services.ts`. Reuse them, do not duplicate.
- Site name, email and legal text live in `lib/site.ts`.
- Do not name the owner's employers or claim certifications that are not stated by the owner.
- Placeholders in square brackets, e.g. `[YOUR PHOTO]`, must be replaced before launch.
