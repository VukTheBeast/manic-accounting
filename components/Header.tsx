import Link from "next/link";
import { LogoMark, Wordmark } from "./Logo";

const links = [
  { href: "/#services", label: "What I do" },
  { href: "/#cashflow", label: "Try the tool" },
  { href: "/#process", label: "How we work" },
  { href: "/#about", label: "About" },
];

export default function Header() {
  return (
    <header className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-4 px-5 py-5 sm:px-8">
      <Link href="/" className="flex items-center gap-3">
        <LogoMark />
        <Wordmark />
      </Link>
      <nav className="flex flex-wrap items-center gap-x-7 gap-y-2.5 sm:ml-auto">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm font-bold text-ink hover:text-ledger"
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
