import { Resend } from "resend";
import { site } from "@/lib/site";

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
  responseLabel: string;
  responseValue: string;
  closing: string;
  signatureRole: string;
  idempotencyKey: string;
};

export async function sendAcknowledgement({
  resend,
  fromAddress,
  to,
  subject,
  greeting,
  paragraphs,
  responseLabel,
  responseValue,
  closing,
  signatureRole,
  idempotencyKey,
}: AcknowledgementOptions) {
  const [signOff, signer = senderNameFor(fromAddress)] = closing.split("\n");
  const text = [
    greeting,
    ...paragraphs,
    `${responseLabel}: ${responseValue}`,
    closing,
    signatureRole,
    site.url,
  ].join("\n\n");
  const html = `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(paragraphs[0] ?? "")}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f7f8fb;font-family:Arial,Helvetica,sans-serif;color:#4b5563">
      <tr>
        <td align="center" style="padding:32px 12px">
          <table role="presentation" width="620" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;background:#ffffff;border:1px solid #dde3ec;border-radius:14px;overflow:hidden">
            <tr>
              <td style="height:6px;background:#c8962e;font-size:0;line-height:0">&nbsp;</td>
            </tr>
            <tr>
              <td style="background:#0b2447;padding:25px 32px">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="78" valign="middle">
                      <img src="cid:manic-accounting-logo" width="64" height="48" alt="Manic Accounting" style="display:block;width:64px;height:48px;border:0">
                    </td>
                    <td valign="middle" style="border-left:1px solid rgba(255,255,255,.35);padding-left:20px">
                      <div style="font-size:20px;line-height:1;font-weight:700;letter-spacing:2px;color:#ffffff">MANIC</div>
                      <div style="margin-top:7px;font-size:9px;line-height:1;font-weight:600;letter-spacing:3.2px;color:#e2b55a">ACCOUNTING</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 36px 32px">
                <p style="margin:0 0 24px;font-size:18px;line-height:1.5;font-weight:700;color:#0b2447">${escapeHtml(greeting)}</p>
                ${paragraphs
                  .map(
                    (paragraph) =>
                      `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#4b5563">${escapeHtml(paragraph)}</p>`,
                  )
                  .join("")}
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:26px 0;background:#f8efd9;border-left:4px solid #c8962e;border-radius:6px">
                  <tr>
                    <td style="padding:16px 18px">
                      <div style="font-size:10px;line-height:1.4;font-weight:700;letter-spacing:1.5px;color:#b07f20;text-transform:uppercase">${escapeHtml(responseLabel)}</div>
                      <div style="margin-top:4px;font-size:15px;line-height:1.5;font-weight:700;color:#0b2447">${escapeHtml(responseValue)}</div>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 7px;font-size:15px;line-height:1.6;color:#4b5563">${escapeHtml(signOff)}</p>
                <p style="margin:0;font-size:16px;line-height:1.5;font-weight:700;color:#0b2447">${escapeHtml(signer)}</p>
                <p style="margin:3px 0 0;font-size:13px;line-height:1.5;color:#7a8594">${escapeHtml(signatureRole)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 36px;background:#f7f8fb;border-top:1px solid #dde3ec">
                <p style="margin:0 0 5px;font-size:12px;line-height:1.5;color:#7a8594">Manic about your numbers. Calm about your books.</p>
                <p style="margin:0;font-size:12px;line-height:1.5">
                  <a href="${escapeHtml(site.url)}" style="color:#b07f20;text-decoration:none;font-weight:700">manic-accounting.com</a>
                  <span style="color:#dde3ec">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                  <a href="mailto:${escapeHtml(fromAddress)}" style="color:#0b2447;text-decoration:none">${escapeHtml(fromAddress)}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return resend.emails.send(
    {
      from: formatSender(fromAddress),
      to,
      replyTo: fromAddress,
      subject,
      text,
      html,
      attachments: [
        {
          path: `${site.url}/manic-accounting-email-logo.png`,
          filename: "manic-accounting-logo.png",
          contentId: "manic-accounting-logo",
        },
      ],
      headers: {
        "Auto-Submitted": "auto-replied",
        "X-Auto-Response-Suppress": "All",
      },
    },
    { idempotencyKey },
  );
}
