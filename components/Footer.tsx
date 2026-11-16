import { LogoMark } from "./Logo";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-ink text-[#d5dbd3]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-8 text-[13px] sm:px-8">
        <div className="flex items-center gap-2.5">
          <LogoMark size={30} variant="yellow" />
          <span className="font-display text-lg font-bold text-paper">{site.name}</span>
        </div>
        <div>
          © {new Date().getFullYear()} {site.name} · {site.legal}
        </div>
      </div>
    </footer>
  );
}
