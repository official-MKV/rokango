import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const chunks = [];
  const reader = req.body.getReader();
  let done, value;
  async function sendTermiiMessage(to, messageType, customMessage) {
    const messageContent = customMessage || getDefaultMessage(messageType);

    const data = {
      to,
      from: "Rokango",
      sms: messageContent,
      type: "plain",
      api_key: process.env.TERMII_API_KEY,
      channel: "generic",
    };

    try {
      const response = await fetch(
        `${process.envTERMII_BASE_URL}/api/sms/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending Termii message:", error);
      throw error;
    }
  }

  function getDefaultMessage(messageType) {
    switch (messageType) {
      case "New Order":
        return "You have received a new order.";
      // Add other cases as needed
      default:
        return "No message content available.";
    }
  }

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
  try {
    if (hash === signature) {
      const { event, data } = JSON.parse(rawBody.toString());
      if (event === "charge.success") {
        const transactionRef = doc(db, "transactions", data.reference);
        const transactionSnap = await getDoc(transactionRef);

        if (transactionSnap.exists()) {
          const transactionData = transactionSnap.data();
          await updateDoc(transactionRef, { status: "success" });
          const cartRef = doc(db, "carts", transactionData.cart_id);
          const cartSnap = await getDoc(cartRef);

          if (cartSnap.exists()) {
            const cartData = cartSnap.data();
            const items = cartData.items || [];
            await updateDoc(cartRef, { ordered: true });
            const itemsBySupplier = items.reduce((acc, item) => {
              if (!acc[item.supplier]) {
                acc[item.supplier] = [];
              }
              acc[item.supplier].push(item);
              return acc;
            }, {});

            for (const [supplier, supplierItems] of Object.entries(
              itemsBySupplier
            )) {
              await addDoc(collection(db, "orders"), {
                order_id: transactionData.cart_id,
                supplier: supplier,
                items: supplierItems,
                status: "pending",
                created_at: new Date(),
                user_email: transactionData.user_email,
              });
              await addDoc(collection(db, "notifications"), {
                recipient: supplier,
                type: "new_order",
                order_id: orderRef.id,
                message: `You have a new order from ${transactionData.user_email}`,
                created_at: new Date(),
                read: false,
              });
              await sendTermiiMessage({
                to: +2349059598249,
                messageType: "New Order",
                customMessage: `You have a new order from ${transactionData.user_email}. Order ID: ${orderRef.id}`,
              });
            }
          }
        }
      } else if (event === "charge.failed") {
        const transactionRef = doc(db, "transactions", data.reference);
        await updateDoc(transactionRef, { status: "failed" });
      }

      return NextResponse.json({ received: true }, { status: 200 });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

export function GET() {
  return new NextResponse("Method Not Allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
}
