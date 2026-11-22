import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  APPROVED_INBOUND_ADDRESSES,
  extractEmailAddress,
  sendAcknowledgement,
  shouldSendAutomaticReply,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  const forwardTo = process.env.CONTACT_FORWARD_TO_EMAIL;
  const forwardFrom = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !webhookSecret || !forwardTo || !forwardFrom) {
    console.error("Resend inbound webhook is not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  }

  const webhookId = request.headers.get("svix-id");
  const webhookTimestamp = request.headers.get("svix-timestamp");
  const webhookSignature = request.headers.get("svix-signature");

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const payload = await request.text();

  let event;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: webhookId,
        timestamp: webhookTimestamp,
        signature: webhookSignature,
      },
      webhookSecret,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ received: true });
  }

  const recipient = [
    ...event.data.received_for,
    ...event.data.to,
    ...event.data.cc,
    ...event.data.bcc,
  ]
    .map(extractEmailAddress)
    .find((address) => APPROVED_INBOUND_ADDRESSES.has(address));

  if (!recipient) {
    console.warn("Ignored inbound email for an unapproved recipient", {
      emailId: event.data.email_id,
    });
    return NextResponse.json({ received: true });
  }

  const inbound = await resend.emails.receiving.get(event.data.email_id);
  if (inbound.error) {
    console.error("Could not retrieve inbound email", {
      emailId: event.data.email_id,
      name: inbound.error.name,
      status: inbound.error.statusCode,
    });
    return NextResponse.json(
      { error: "Email retrieval failed" },
      { status: 502 },
    );
  }

  const forward = await resend.emails.receiving.forward(
    {
      emailId: event.data.email_id,
      from: forwardFrom,
      to: forwardTo,
      passthrough: true,
    },
    { idempotencyKey: `inbound-forward-${event.data.email_id}` },
  );

  if (forward.error) {
    console.error("Could not forward inbound email", {
      emailId: event.data.email_id,
      name: forward.error.name,
      status: forward.error.statusCode,
    });
    return NextResponse.json(
      { error: "Email forwarding failed" },
      { status: 502 },
    );
  }

  if (shouldSendAutomaticReply(inbound.data.from, inbound.data.headers)) {
    const sender = extractEmailAddress(inbound.data.from);
    const acknowledgement = await sendAcknowledgement({
      resend,
      fromAddress: recipient,
      to: sender,
      subject: "We received your email | Manic Accounting",
      greeting: "Hello,",
      paragraphs: [
        "Thank you for contacting Manic Accounting. Your email has arrived safely.",
        "I will review your message and reply personally within two working days.",
      ],
      closing: `Best regards,\n${recipient === "vukman.manic@manic-accounting.com" ? "Vukman Manić" : "Manic Accounting"}`,
      idempotencyKey: `inbound-ack-${event.data.email_id}`,
    });

    if (acknowledgement.error) {
      console.error("Could not acknowledge inbound email", {
        emailId: event.data.email_id,
        name: acknowledgement.error.name,
        status: acknowledgement.error.statusCode,
      });
      return NextResponse.json(
        { error: "Email acknowledgement failed" },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
