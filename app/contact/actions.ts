"use server";

import { headers } from "next/headers";
import { SERVICES, serviceById } from "@/lib/services";
import { checkContactRateLimit } from "@/lib/rate-limit";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const value = (formData: FormData, key: string, maxLength: number) => {
  const input = formData.get(key);
  return typeof input === "string" ? input.trim().slice(0, maxLength) : "";
};

const singleLine = (input: string) => input.replace(/[\r\n]+/g, " ");

export async function sendContactMessage(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (value(formData, "website", 200)) {
    return {
      status: "success",
      message: "Thanks for writing. I will reply within two working days.",
    };
  }

  const name = value(formData, "name", 120);
  const email = value(formData, "email", 200);
  const serviceId = value(formData, "service", 40);
  const message = value(formData, "message", 5000);
  const service = SERVICES.some(({ id }) => id === serviceId)
    ? serviceById(serviceId)
    : serviceById("unsure");

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      message: "Please check your name, email address and message, then try again.",
    };
  }

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const rateLimit = checkContactRateLimit(clientIp);

  if (!rateLimit.allowed) {
    const minutes = Math.max(1, Math.ceil(rateLimit.retryAfterSeconds / 60));
    return {
      status: "error",
      message: `Too many messages were sent from this connection. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "Manić Accounting <onboarding@resend.dev>";

  if (!key || !to) {
    return {
      status: "error",
      message: "Online sending is not configured yet. Please use the direct email link below.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `Enquiry: ${singleLine(service.label)} (${singleLine(name)})`,
        text: `Name: ${name}\nEmail: ${email}\nService: ${service.label}\n\n${message}`,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error("Resend rejected a contact form request", {
        status: response.status,
      });
      return {
        status: "error",
        message: "The message could not be sent right now. Please use the direct email link below.",
      };
    }
  } catch (error) {
    console.error("Contact form delivery failed", error);
    return {
      status: "error",
      message: "The message could not be sent right now. Please use the direct email link below.",
    };
  }

  return {
    status: "success",
    message: "Thanks for writing. I will reply within two working days.",
  };
}
