"use server";

import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getServices, serviceById } from "@/lib/services";
import { checkContactRateLimit } from "@/lib/rate-limit";

export type ContactFormCode =
  | "none"
  | "success"
  | "invalid"
  | "rateLimited"
  | "notConfigured"
  | "sendFailed";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  code: ContactFormCode;
  minutes?: number;
};

const value = (formData: FormData, key: string, maxLength: number) => {
  const input = formData.get(key);
  return typeof input === "string" ? input.trim().slice(0, maxLength) : "";
};

const singleLine = (input: string) => input.replace(/[\r\n]+/g, " ");
const redactEmails = (input: string) =>
  input.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "[email]");

export async function sendContactMessage(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (value(formData, "website", 200)) {
    return {
      status: "success",
      code: "success",
    };
  }

  const localeValue = value(formData, "locale", 5);
  const locale = hasLocale(routing.locales, localeValue)
    ? localeValue
    : routing.defaultLocale;
  const name = value(formData, "name", 120);
  const email = value(formData, "email", 200);
  const serviceId = value(formData, "service", 40);
  const message = value(formData, "message", 5000);
  const services = getServices(locale);
  const service = services.some(({ id }) => id === serviceId)
    ? serviceById(serviceId, locale)
    : serviceById("unsure", locale);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      code: "invalid",
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
      code: "rateLimited",
      minutes,
    };
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!key || !to || !from) {
    return {
      status: "error",
      code: "notConfigured",
    };
  }

  const t = await getTranslations({ locale, namespace: "Email" });

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
        subject: t("subject", {
          service: singleLine(service.label),
          name: singleLine(name),
        }),
        text: `${t("name")}: ${name}\n${t("email")}: ${email}\n${t("service")}: ${service.label}\n\n${message}`,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const errorBody: unknown = await response.json().catch(() => null);
      const resendError =
        errorBody && typeof errorBody === "object"
          ? {
              name:
                "name" in errorBody && typeof errorBody.name === "string"
                  ? errorBody.name
                  : undefined,
              message:
                "message" in errorBody && typeof errorBody.message === "string"
                  ? redactEmails(errorBody.message)
                  : undefined,
            }
          : {};

      console.error("Resend rejected a contact form request", {
        status: response.status,
        ...resendError,
      });
      return {
        status: "error",
        code: "sendFailed",
      };
    }
  } catch (error) {
    console.error("Contact form delivery failed", error);
    return {
      status: "error",
      code: "sendFailed",
    };
  }

  return {
    status: "success",
    code: "success",
  };
}
