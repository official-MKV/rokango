import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ROLE_KEY
);

export async function POST(request) {
  try {
    const formData = await request.json();
    const { productId, ...productData } = formData;

    // Update the product data in Supabase
    const { data, error } = await supabase
      .from("products")
      .update({ ...productData })
      .eq("id", productId);

    if (error) {
      throw new Error(`Product update error: ${error.message}`);
    }

    return NextResponse.json({ product: data[0] }, { status: 200 });
  } catch (error) {
    console.error("Error in product update route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
