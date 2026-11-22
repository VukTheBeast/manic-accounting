import { Resend } from "resend";

const OWN_DOMAIN = "manic-accounting.com";
const AUTOMATED_LOCAL_PARTS = [
  "mailer-daemon",
  "postmaster",
  "no-reply",
  "noreply",
  "do-not-reply",
];

export const APPROVED_INBOUND_ADDRESSES = new Set([
  "contact@manic-accounting.com",
  "vukman.manic@manic-accounting.com",
]);

export const extractEmailAddress = (value: string) => {
  const angleAddress = value.match(/<([^<>]+)>/)?.[1];
  return (angleAddress ?? value).trim().toLowerCase();
};

export const senderNameFor = (address: string) =>
  address === "vukman.manic@manic-accounting.com"
    ? "Vukman Manić"
    : "Manic Accounting";

export const formatSender = (address: string) =>
  `${senderNameFor(address)} <${address}>`;

const normalizedHeaders = (headers: Record<string, string> | null) =>
  Object.fromEntries(
    Object.entries(headers ?? {}).map(([key, value]) => [
      key.toLowerCase(),
      value.toLowerCase(),
    ]),
  );

export const shouldSendAutomaticReply = (
  from: string,
  headers: Record<string, string> | null,
) => {
  const address = extractEmailAddress(from);
  const [localPart, domain] = address.split("@");

  if (
    !localPart ||
    !domain ||
    domain === OWN_DOMAIN ||
    AUTOMATED_LOCAL_PARTS.some((part) => localPart.includes(part))
  ) {
    return false;
  }

  const values = normalizedHeaders(headers);
  const autoSubmitted = values["auto-submitted"];
  const precedence = values.precedence;

  return !(
    (autoSubmitted && autoSubmitted !== "no") ||
    ["bulk", "junk", "list"].includes(precedence) ||
    values["x-auto-response-suppress"] ||
    values["list-id"]
  );
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

type AcknowledgementOptions = {
  resend: Resend;
  fromAddress: string;
  to: string;
  subject: string;
  greeting: string;
  paragraphs: string[];
  closing: string;
  idempotencyKey: string;
};

export async function sendAcknowledgement({
  resend,
  fromAddress,
  to,
  subject,
  greeting,
  paragraphs,
  closing,
  idempotencyKey,
}: AcknowledgementOptions) {
  const text = [greeting, ...paragraphs, closing].join("\n\n");
  const html = `
    <div style="background:#f5f6f7;padding:32px 16px;font-family:Arial,sans-serif;color:#14213d">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #d9dee7;border-radius:12px;padding:32px">
        <p style="margin:0 0 20px;font-size:16px">${escapeHtml(greeting)}</p>
        ${paragraphs
          .map(
            (paragraph) =>
              `<p style="margin:0 0 16px;line-height:1.6">${escapeHtml(paragraph)}</p>`,
          )
          .join("")}
        <p style="margin:24px 0 0;line-height:1.6">${escapeHtml(closing).replaceAll("\n", "<br>")}</p>
      </div>
    </div>
  `;

  return resend.emails.send(
    {
      from: formatSender(fromAddress),
      to,
      replyTo: fromAddress,
      subject,
      text,
      html,
      headers: {
        "Auto-Submitted": "auto-replied",
        "X-Auto-Response-Suppress": "All",
      },
    },
    { idempotencyKey },
  );
}
