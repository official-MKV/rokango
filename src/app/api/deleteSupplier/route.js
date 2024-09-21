// app/api/deleteSupplier/route.js
import { NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase-admin";

export async function POST(request) {
  try {
    const { supplierId } = await request.json();

    if (!supplierId) {
      return NextResponse.json(
        { success: false, message: "Supplier ID is required" },
        { status: 400 }
      );
    }

    // TODO: Add authentication and authorization checks here

    const batch = db.batch();

    const productsSnapshot = await db
      .collection("products")
      .where("supplier.id", "==", supplierId)
      .get();

    productsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    const ordersSnapshot = await db
      .collection("orders")
      .where("suppliers", "array-contains", supplierId)
      .where("status", "==", "pending")
      .get();

    ordersSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { status: "abandoned" });
    });

    const userRef = db.collection("users").doc(supplierId);
    batch.delete(userRef);

    await batch.commit();

    await auth.deleteUser(supplierId);

    return NextResponse.json({
      success: true,
      message: "Supplier and related data deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while deleting the supplier.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
