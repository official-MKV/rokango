import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ROLE_KEY
);

// Function to generate a Firebase-like ID
function generateFirebaseId(timestamp = Date.now()) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let autoId = "";
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${timestamp}-${autoId}`;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const productData = JSON.parse(formData.get("productData"));
    const imageFile = formData.get("image");

    console.log(productData);
    let imageUrl = null;

    // Generate a Firebase-like ID
    const productId = generateFirebaseId();

    // Upload image if provided
    if (imageFile) {
      const fileName = `${productId}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images-uploaded")
        .upload(fileName, imageFile);

      if (uploadError) {
        throw new Error(`Image upload error: ${uploadError.message}`);
      }

      // Get public URL for the uploaded image
      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    // Add the product to the 'products' table with the generated ID
    const { data, error } = await supabase
      .from("products")
      .insert([{ id: productId, ...productData, image: imageUrl }])
      .select();

    if (error) {
      throw new Error(`Product insert error: ${error.message}`);
    }

    return NextResponse.json({ product: data[0] }, { status: 201 });
  } catch (error) {
    console.error("Error in POST function:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "This endpoint only supports POST requests" },
    { status: 405 }
  );
}
