import { NextResponse } from "next/server";

type Body = {
  name?: unknown;
  email?: unknown;
  service?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
};

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Bots fill the hidden field. Pretend success, send nothing.
  if (str(body.website, 200)) return NextResponse.json({ ok: true });

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const service = str(body.service, 120);
  const message = str(body.message, 5000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    // Email is not configured yet: the form shows a mailto fallback.
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }
  const from = process.env.CONTACT_FROM_EMAIL ?? "Manić Accounting <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `Enquiry: ${service || "General"} (${name})`,
      text: `Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`,
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "send_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
