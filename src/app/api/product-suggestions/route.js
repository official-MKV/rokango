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
  console.log(query);
  try {
    // Use ILIKE for partial matching, but also use similarity for fuzzy matching.
    const { data, error } = await supabase
      .from("product_images")
      .select("id, name, image_url, description, categories")
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`) // Partial matching across name, description, and categories
      .limit(10);

    if (error) throw error;

    // Perform a fuzzy search using similarity if no results found from ILIKE
    if (data.length === 0) {
      const { data: fuzzyData, error: fuzzyError } = await supabase.rpc(
        "fuzzy_search_products", // Custom function we will create in PostgreSQL
        { query }
      );

      if (fuzzyError) throw fuzzyError;

      return NextResponse.json(fuzzyData);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching product suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch product suggestions" },
      { status: 500 }
    );
  }
}
