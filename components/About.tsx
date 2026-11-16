import Link from "next/link";

const FACTS: [string, string][] = [
  ["In finance", "10 years"],
  ["Led finance teams in", "Czechia and the US"],
  ["VAT filing", "CZ · BG · RO"],
  ["Automation", "RPA/RDA in accounting"],
  ["Working", "Remote-first"],
];

export default function About() {
  return (
    <section id="about" className="mx-auto flex max-w-[1200px] scroll-mt-4 flex-wrap items-start gap-x-14 gap-y-12 px-5 py-24 sm:px-8">
      <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5">
        <div className="overline">ABOUT</div>
        <h2 className="h2">Yes, Manić is my real surname.</h2>
        <p className="text-[17px] leading-[1.7]">
          Everybody makes the joke, so I made it the brand. Behind the pun is a decade in finance
          and controlling: from general ledger and reconciliations to leading a finance team and
          steering costs across global functions of a multinational.
        </p>
        <p className="text-[17px] leading-[1.7]">
          I have closed the books for entities in Europe, the US and Canada, built process
          automation for accounting teams, and filed VAT in three countries. By day I am a finance
          controller. Now I am bringing the same obsessiveness to a few smaller businesses who
          deserve it too.
        </p>
        <div>
          <Link href="/contact" className="btn-marker">Let&apos;s talk numbers</Link>
        </div>
      </div>

      <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
        {/* Replace with: <Image src="/photo.jpg" ... /> once you have a photo in /public */}
        <div className="flex h-[280px] items-center justify-center rounded-card border-2 border-dashed border-[#9aa39c] bg-[#e6ebe0] text-sm font-bold">
          [YOUR PHOTO: relaxed, not in a tie]
        </div>
        <div className="card flex flex-col gap-3.5 p-6">
          <div className="text-xs font-bold tracking-[0.6px] text-ink">THE SHORT VERSION</div>
          {FACTS.map(([k, v], i) => (
            <div
              key={k}
              className={`flex justify-between gap-4 text-[15px] ${i < FACTS.length - 1 ? "border-b border-[#dde3dc] pb-3" : ""}`}
            >
              <span>{k}</span>
              <strong className="text-right text-ink">{v}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
