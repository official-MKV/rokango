import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ROLE_KEY
);

export async function POST(request) {
  const { productId } = await request.json();

  try {
    // Update the product in Supabase to set active to false
    const { error } = await supabase
      .from("products")
      .update({ active: false })
      .eq("id", productId);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Product deactivated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deactivating product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
