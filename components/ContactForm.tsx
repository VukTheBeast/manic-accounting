"use client";

import { useState, type FormEvent } from "react";
import { SERVICES, serviceById } from "@/lib/services";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState<string>(SERVICES[0].id);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  const [status, setStatus] = useState<Status>("idle");

  const svc = serviceById(service);

  // Fallback if the email API is not configured yet
  const mailto =
    `mailto:${site.email}?subject=${encodeURIComponent("Enquiry: " + svc.label)}` +
    `&body=${encodeURIComponent(`Hi,\n\nI need help with: ${svc.label}\n\n${message}\n\n${name}\n${email}`)}`;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, service: svc.label, message, website }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card flex flex-col gap-3 p-[clamp(20px,4vw,36px)]">
        <p className="font-display text-[28px] leading-tight font-bold text-ledger">
          Received. Debit equals credit.
        </p>
        <p className="text-base leading-relaxed">Thanks for writing. I will reply within two working days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-5 p-[clamp(20px,4vw,36px)]">
      <div className="flex flex-wrap gap-5">
        <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-1.5">
          <label htmlFor="f-name" className="text-[13px] font-bold text-ink">Your name</label>
          <input id="f-name" name="name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="field" />
        </div>
        <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-1.5">
          <label htmlFor="f-mail" className="text-[13px] font-bold text-ink">Your email</label>
          <input id="f-mail" name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-need" className="text-[13px] font-bold text-ink">What do you need help with?</label>
        <select id="f-need" name="service" value={service} onChange={(e) => setService(e.target.value)} className="field">
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <div className="mt-1.5 flex flex-col gap-1 rounded-[10px] bg-ledger-tint px-4 py-3.5">
          <span className="text-sm font-bold text-ledger">{svc.label}</span>
          <span className="text-sm leading-relaxed">{svc.desc}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-msg" className="text-[13px] font-bold text-ink">A few lines about your situation</label>
        <textarea id="f-msg" name="message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-y" />
      </div>

      {/* honeypot: hidden from people, bots fill it in */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="f-web">Website</label>
        <input id="f-web" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" disabled={status === "sending"} className="btn-marker disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <span className="min-w-[200px] flex-1 text-[13px] leading-normal">
          I reply within two working days. The intro call is free.
        </span>
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-[10px] bg-red-tint p-3.5 text-sm font-semibold leading-normal text-red-pen">
          Something went wrong sending that.{" "}
          <a href={mailto} className="underline">Email me directly instead</a> and the message will be pre-filled.
        </p>
      )}
    </form>
  );
}
