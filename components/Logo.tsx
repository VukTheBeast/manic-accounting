type Variant = "green" | "yellow" | "dark";

const colors: Record<Variant, { m: string; chart: string; bars: string }> = {
  green: {
    m: "var(--color-ink)",
    chart: "var(--color-marker)",
    bars: "var(--color-marker-light)",
  },
  yellow: {
    m: "#ffffff",
    chart: "var(--color-marker)",
    bars: "var(--color-marker-light)",
  },
  dark: {
    m: "var(--color-ink)",
    chart: "var(--color-marker)",
    bars: "var(--color-marker-light)",
  },
};

export function LogoMark({
  size = 54,
  variant = "green",
}: {
  size?: number;
  variant?: Variant;
}) {
  const c = colors[variant];
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 480 360" aria-hidden="true" focusable="false">
      <defs>
        <mask id="manic-logo-cutout" maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="360">
          <rect width="480" height="360" fill="#ffffff" />
          <path
            d="M8 353C130 268 330 215 475 62C455 170 330 300 135 353Z"
            fill="#000000"
            stroke="#000000"
            strokeWidth="14"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <path mask="url(#manic-logo-cutout)" fill={c.m} d="M0 7H96L241 185L388 7H475V340H360V215C300 262 150 318 0 340Z" />
      <rect x="48" y="238" width="28" height="82" rx="4" fill={c.bars} />
      <rect x="103" y="196" width="28" height="100" rx="4" fill={c.bars} />
      <rect x="158" y="154" width="28" height="100" rx="4" fill={c.bars} />
      <path d="M8 353C130 268 330 215 475 62C455 170 330 300 135 353Z" fill={c.chart} />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3 leading-none">
      <span className={`h-10 w-0.5 rounded-full ${light ? "bg-white" : "bg-ink"}`} />
      <span className="flex flex-col">
        <span
          className={`font-display text-[22px] font-extrabold tracking-[0.08em] ${light ? "text-paper" : "text-ink"}`}
        >
          MANIC
        </span>
        <span
          className={`mt-1.5 text-[9px] font-medium tracking-[0.42em] ${light ? "text-paper" : "text-ink"}`}
        >
          ACCOUNTING
        </span>
      </span>
    </span>
  );
}
