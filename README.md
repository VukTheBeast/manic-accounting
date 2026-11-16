# Manic Accounting website

Next.js (App Router) + React + Tailwind CSS v4. English, Czech and Serbian Latin versions are
available under `/en`, `/cs` and `/sr`. The site includes two interactive demos (ledger and
13-week cash flow) and a contact form with a service dropdown.

## Run it locally (VS Code)

1. Install **Node.js 20.19+** (Node.js 22 LTS recommended) and open this folder in VS Code (`File > Open Folder`).
2. Open the terminal (`Ctrl+` ` ) and run:
   ```bash
   npm install
   cp .env.example .env.local     # Windows: copy .env.example .env.local
   npm run dev
   ```
3. Open http://localhost:3000. It redirects to the best matching language. Edits show up instantly.

Useful commands: `npm run build` (production build), `npm run lint` (ESLint),
`npm run typecheck` (TypeScript) and `npm run check` (both).

## Things to replace before launch

Search the project for `[` placeholders and `your-domain.com`:

| What | Where |
| --- | --- |
| Email, phone, business registration number | `lib/site.ts` and `.env.local` |
| Service names and descriptions | `lib/services.ts` (all three languages) |
| Other translated content | `messages/en.json`, `messages/cs.json`, `messages/sr.json` |
| Colors, fonts | `app/globals.css` (`@theme` block) |

## Make the contact form send real email (Resend)

1. Create a free account at https://resend.com and an API key.
2. Fill in `.env.local`:
   ```
   RESEND_API_KEY=re_xxx
   CONTACT_TO_EMAIL=his-real-address@example.com
   CONTACT_FROM_EMAIL="Manic Accounting <onboarding@resend.dev>"
   ```
   `onboarding@resend.dev` works for testing. For production, verify his domain in Resend and use an
   address on it.
3. Restart `npm run dev` and send a test message.

Until this is configured, the form shows a localized direct-email fallback. A hidden honeypot and
server-side rate limiting block common spam attempts.

## Deploy (free)

1. Push the project to a GitHub repository.
2. Go to https://vercel.com, import the repo, and add the same environment variables from `.env.local`.
3. Deploy. Connect his own domain under Project > Settings > Domains.

## Working with GitHub Copilot

`.github/copilot-instructions.md` tells Copilot about the brand, the tone and the Tailwind tokens, so its
suggestions stay on-style. Good first prompts in Copilot Chat:

- "Add a testimonials section on the home page below the process steps, using the existing card style"
- "Add a pricing section with three packages using the `.card` class"

## Structure

```
app/
  [locale]/layout.tsx   fonts, localized metadata and language provider
  [locale]/page.tsx     localized home page
  [locale]/contact/     localized contact page
  contact/actions.ts    validates and sends contact email through Resend
  globals.css           Tailwind theme + .card, .btn-marker, .field helpers
components/             Header, Footer, Logo, LedgerDemo, CashFlowTool, Services, Process, About, ContactForm...
i18n/                   locale routing, navigation and request configuration
messages/               English, Czech and Serbian translations
lib/                    site.ts (contact details), services.ts (localized service list)
proxy.ts                locale detection and redirects
```

Note: `next/font/google` downloads the fonts at build time, so the first `npm run dev` needs internet access.
