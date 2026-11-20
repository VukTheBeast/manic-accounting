import { LogoMark, Wordmark } from "./Logo";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-paper/15 bg-ink text-paper/70">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-5 px-5 py-10 text-[13px] sm:px-8">
        <div className="flex items-center gap-2.5">
          <LogoMark size={42} variant="yellow" />
          <Wordmark light />
        </div>
        <div className="flex flex-col items-start gap-1.5 sm:items-end">
          <a
            href={`mailto:${site.email}`}
            className="font-semibold text-paper transition-colors hover:text-marker"
          >
            {site.email}
          </a>
          <span>
            © {new Date().getFullYear()} {site.name}
            {site.legal && <> · {site.legal}</>}
          </span>
        </div>
      </div>
    </footer>
  );
}
