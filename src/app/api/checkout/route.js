import { NextResponse } from "next/server";

const PAYSTACK_API_URL = "https://api.paystack.co/transaction/initialize";

export async function POST(req) {
  try {
    // Parse the JSON body from the request
    const body = await req.json();

    // Validate required fields
    if (!body.email || !body.amount || !body.order_id) {
      return NextResponse.json(
        { error: "Missing required fields: email, amount, or order_id" },
        { status: 400 }
      );
    }

    const details = {
      email: body.email,
      amount: Math.round(body.amount * 100), // Paystack expects amount in kobo (smallest currency unit)
      currency: "NGN",
      ref: body.ref,
    };

    const res = await fetch(PAYSTACK_API_URL, {
      method: "POST",
      body: JSON.stringify(details),
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json(data);
    } else {
      console.error("Paystack API error:", data);
      return NextResponse.json(
        { error: "Failed to initialize transaction", details: data },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
