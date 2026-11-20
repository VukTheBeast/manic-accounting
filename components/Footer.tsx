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
        <div>
          © {new Date().getFullYear()} {site.name}
          {site.legal && <> · {site.legal}</>}
        </div>
      </div>
    </footer>
  );
}
