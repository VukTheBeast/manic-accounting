# Manić Accounting website

Next.js (App Router) + React + Tailwind CSS v4. Two pages (`/` and `/contact`), two interactive demos
(ledger and 13-week cash flow) and a contact form with a service dropdown.

## Run it locally (VS Code)

1. Install **Node.js 20.19+** (Node.js 22 LTS recommended) and open this folder in VS Code (`File > Open Folder`).
2. Open the terminal (`Ctrl+` ` ) and run:
   ```bash
   npm install
   cp .env.example .env.local     # Windows: copy .env.example .env.local
   npm run dev
   ```
3. Open http://localhost:3000. Edits show up instantly.

Useful commands: `npm run build` (production build), `npm run lint` (ESLint),
`npm run typecheck` (TypeScript) and `npm run check` (both).

## Things to replace before launch

Search the project for `[` placeholders and `your-domain.com`:

| What | Where |
| --- | --- |
| Email, phone, business registration number | `lib/site.ts` and `.env.local` |
| Photo | `components/About.tsx` (put the file in `/public`) |
| Service names and descriptions | `lib/services.ts` (used by the cards and the dropdown) |
| Colors, fonts | `app/globals.css` (`@theme` block) |

## Make the contact form send real email (Resend)

1. Create a free account at https://resend.com and an API key.
2. Fill in `.env.local`:
   ```
   RESEND_API_KEY=re_xxx
   CONTACT_TO_EMAIL=his-real-address@example.com
   CONTACT_FROM_EMAIL="Manić Accounting <onboarding@resend.dev>"
   ```
   `onboarding@resend.dev` works for testing. For production, verify his domain in Resend and use an
   address on it.
3. Restart `npm run dev` and send a test message.

Until this is configured, the form shows an error with an "Email me directly" link that opens a pre-filled
email. A hidden honeypot field blocks most spam bots.

## Deploy (free)

1. Push the project to a GitHub repository.
2. Go to https://vercel.com, import the repo, and add the same environment variables from `.env.local`.
3. Deploy. Connect his own domain under Project > Settings > Domains.

## Working with GitHub Copilot

`.github/copilot-instructions.md` tells Copilot about the brand, the tone and the Tailwind tokens, so its
suggestions stay on-style. Good first prompts in Copilot Chat:

- "Add a Serbian version of the site using next-intl" (or a simple `/sr` route)
- "Add a testimonials section on the home page below the process steps, using the existing card style"
- "Add Open Graph metadata and a sitemap"
- "Add a pricing section with three packages using the `.card` class"

## Structure

```
app/
  layout.tsx            fonts, metadata
  page.tsx              home page
  contact/page.tsx      contact page
  api/contact/route.ts  sends the email (Resend)
  globals.css           Tailwind theme + .card, .btn-marker, .field helpers
components/             Header, Footer, Logo, LedgerDemo, CashFlowTool, Services, Process, About, ContactForm...
lib/                    site.ts (contact details), services.ts (service list)
```

Note: `next/font/google` downloads the fonts at build time, so the first `npm run dev` needs internet access.
