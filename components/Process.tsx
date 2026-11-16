const STEPS = [
  {
    n: "01",
    title: "Intro call",
    text: "Thirty minutes, free. You tell me what hurts. I tell you honestly whether I can help.",
  },
  {
    n: "02",
    title: "Books health-check",
    text: "I go through what you have and tell you what is off, in plain language, with a fix for each point.",
  },
  {
    n: "03",
    title: "Set the rhythm",
    text: "A monthly close, a reporting calendar and tax deadlines locked in. You always know what happens when.",
  },
  {
    n: "04",
    title: "Quiet confidence",
    text: "Numbers arrive on time and make sense. I carry on being a little bit manic so you do not have to be.",
  },
];

export default function Process() {
  return (
    <section id="process" className="scroll-mt-4 bg-ink text-[#d5dbd3]">
      <div className="mx-auto max-w-[1200px] px-5 pt-22 pb-24 sm:px-8">
        <div className="mb-3 text-xs font-bold tracking-[0.6px] text-marker">HOW WE WORK</div>
        <h2 className="mb-12 max-w-[720px] font-display text-[clamp(32px,7.5vw,46px)] leading-[1.08] font-bold text-paper">
          No jargon. No surprises. Slightly obsessive.
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-8">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col gap-2.5">
              <div className="font-display text-[56px] leading-none font-bold text-marker">{s.n}</div>
              <h3 className="text-xl font-bold text-paper">{s.title}</h3>
              <p className="text-[15px] leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
