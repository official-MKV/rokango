// app/api/deleteRetailer/route.js
import { NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase-admin";

export async function POST(request) {
  try {
    const { retailerId } = await request.json();

    if (!retailerId) {
      return NextResponse.json(
        { success: false, message: "Retailer ID is required" },
        { status: 400 }
      );
    }

    // TODO: Add authentication and authorization checks here

    const batch = db.batch();

    // 1. Update pending orders
    const ordersSnapshot = await db
      .collection("orders")
      .where("retailer.id", "==", retailerId)
      .where("status", "==", "pending")
      .get();

    ordersSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { status: "abandoned" });
    });

    // 2. Delete ordered carts
    const cartsSnapshot = await db
      .collection("carts")
      .where("userId", "==", retailerId)
      .where("ordered", "==", true)
      .get();

    cartsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 3. Delete the user document
    const userRef = db.collection("users").doc(retailerId);
    batch.delete(userRef);

    // Commit the batch
    await batch.commit();

    // 4. Delete the user from Authentication
    await auth.deleteUser(retailerId);

    return NextResponse.json({
      success: true,
      message: "Retailer and related data deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting retailer:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while deleting the retailer.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
