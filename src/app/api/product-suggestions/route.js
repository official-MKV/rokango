// app/api/product-suggestions/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters long" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, image_url")
      .ilike("name", `${query}%`)
      .limit(5);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching product suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch product suggestions" },
      { status: 500 }
    );
  }
}
