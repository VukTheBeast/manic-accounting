"use server";

import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import { routing } from "@/i18n/routing";
import { sendAcknowledgement } from "@/lib/email";
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
  const to =
    process.env.CONTACT_FORWARD_TO_EMAIL ?? process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!key || !to || !from) {
    return {
      status: "error",
      code: "notConfigured",
    };
  }

  const t = await getTranslations({ locale, namespace: "Email" });
  const resend = new Resend(key);

  try {
    const notification = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Website contact form] ${t("subject", {
        service: singleLine(service.label),
        name: singleLine(name),
      })}`,
      text: `${t("source")}: manic-accounting.com\n${t("name")}: ${name}\n${t("email")}: ${email}\n${t("service")}: ${service.label}\n\n${message}`,
    });

    if (notification.error) {
      console.error("Resend rejected a contact form request", {
        status: notification.error.statusCode,
        name: notification.error.name,
        message: redactEmails(notification.error.message),
      });
      return {
        status: "error",
        code: "sendFailed",
      };
    }

    const acknowledgement = await sendAcknowledgement({
      resend,
      fromAddress: "contact@manic-accounting.com",
      to: email,
      subject: t("acknowledgementSubject"),
      greeting: t("acknowledgementGreeting", { name: singleLine(name) }),
      paragraphs: [
        t("acknowledgementReceived"),
        t("acknowledgementResponse"),
      ],
      responseLabel: t("acknowledgementResponseLabel"),
      responseValue: t("acknowledgementResponseValue"),
      closing: t("acknowledgementClosing"),
      signatureRole: t("acknowledgementSignatureRole"),
      idempotencyKey: `contact-form-ack-${notification.data.id}`,
    });

    if (acknowledgement.error) {
      console.error("Contact form acknowledgement failed", {
        submissionId: notification.data.id,
        status: acknowledgement.error.statusCode,
        name: acknowledgement.error.name,
        message: redactEmails(acknowledgement.error.message),
      });
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
