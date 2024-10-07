import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ROLE_KEY
);

export async function POST(request) {
  const { productId, supplierId } = await request.json();

  try {
    // Check for existing orders in Firebase using admin SDK
    const ordersRef = db.collection("orders");
    const querySnapshot = await ordersRef
      .where("supplier.id", "==", supplierId)
      .where("items", "array-contains", { id: productId })
      .get();

    const hasOrders = !querySnapshot.empty;

    return NextResponse.json({ hasOrders }, { status: 200 });
  } catch (error) {
    console.error("Error checking for orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { productId } = await request.json();

  try {
    // Delete the product from Supabase
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
