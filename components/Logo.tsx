type Variant = "green" | "yellow" | "dark";

const colors: Record<Variant, { bg: string; m: string; tick: string }> = {
  green: { bg: "#0B6B4F", m: "#FFFFFF", tick: "#FFE14D" },
  yellow: { bg: "#FFE14D", m: "#14171A", tick: "#0B6B4F" },
  dark: { bg: "#14171A", m: "#FFFFFF", tick: "#FFE14D" },
};

/** The "M" mark. The yellow tick is the acute accent of the ć. */
export function LogoMark({
  size = 42,
  variant = "green",
}: {
  size?: number;
  variant?: Variant;
}) {
  const c = colors[variant];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="18" fill={c.bg} />
      <path
        d="M15 49V30L32 46L49 30V49"
        fill="none"
        stroke={c.m}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M40 20L50 11" stroke={c.tick} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className={`font-display text-[26px] font-bold ${light ? "text-paper" : "text-ink"}`}
      >
        Manić
      </span>
      <span
        className={`mt-[3px] text-[10px] font-bold tracking-[2.2px] ${light ? "text-marker" : "text-ledger"}`}
      >
        ACCOUNTING
      </span>
    </span>
  );
}
