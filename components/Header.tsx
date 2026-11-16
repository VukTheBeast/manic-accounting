import Link from "next/link";
import { LogoMark, Wordmark } from "./Logo";
import { site } from "@/lib/site";

const siteName = site.name;

const links = [
  { href: "/#services", label: "What I do" },
  { href: "/#cashflow", label: "Try the tool" },
  { href: "/#process", label: "How we work" },
  { href: "/#about", label: "About" },
];

export default function Header() {
  return (
    <header className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-4 px-5 py-5 sm:px-8">
      <Link href="/" className="flex min-h-11 items-center gap-3" aria-label={`${siteName} home`}>
        <LogoMark />
        <Wordmark />
      </Link>
      <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:ml-auto">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex min-h-11 items-center px-1 text-sm font-bold text-ink hover:text-ledger"
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/contact"
          className="rounded-[10px] border-2 border-ink bg-marker px-5 py-3 text-[15px] font-bold text-ink shadow-hard-sm transition-colors hover:bg-marker-dark"
        >
          Book a call
        </Link>
      </nav>
    </header>
  );
}
