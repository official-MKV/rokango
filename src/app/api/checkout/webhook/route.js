import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

export async function POST(req) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  const chunks = [];
  const reader = req.body.getReader();
  let done, value;

  while (!done) {
    ({ done, value } = await reader.read());
    if (value) {
      chunks.push(value);
    }
  }

  const rawBody = Buffer.concat(chunks);

  // Verify the signature
  const signature = req.headers.get("x-paystack-signature");
  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  if (hash === signature) {
    // Signature is valid, process the webhook
    const event = JSON.parse(rawBody.toString());

    // TODO: Do something with the event
    console.log("Received valid webhook:", event);

    return NextResponse.json({
      message: "Webhook received and processed successfully",
    });
  } else {
    // Invalid signature
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }
}

export function GET() {
  return new NextResponse("Method Not Allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
}
