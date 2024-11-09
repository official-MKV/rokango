import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ROLE_KEY
);

export async function POST(request) {
  const {
    tableName,
    filters,
    page,
    pageSize,
    searchField,
    searchTerm,
    orderByField,
    orderDirection,
    relations = [],
  } = await request.json();

  let productIds = [];
  console.log(`filters:${JSON.stringify(filters)}`);

  if (filters.category && relations.includes("product_categories")) {
    // Check if `filters.category` is a slug or an ID
    const isSlug = typeof filters.category === "string";

    // Query product IDs associated with the specified category (by slug or ID)
    const { data: categoryData, error: categoryError } = await supabase
      .from("product_categories")
      .select("product, category!inner(slug, id)") // Use foreign key relationship
      .eq(isSlug ? "category.slug" : "category.id", filters.category);

    if (categoryError) {
      return NextResponse.json(
        { error: categoryError.message },
        { status: 500 }
      );
    }

    // Extract product IDs
    productIds = categoryData.map((item) => item.product);
    delete filters.category; // Remove category filter from main query
  }

  // Create initial query for the specified `tableName`
  let query = supabase.from(tableName).select("*", { count: "exact" });

  // Apply the product ID filter if productIds array is populated
  if (productIds.length > 0) {
    query = query.in("id", productIds);
  }

  // Apply other filters
  Object.entries(filters).forEach(([key, value]) => {
    console.log(`key:${value}`);
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        query = query.contains(key, value);
      } else {
        query = query.ilike(key, value.toLowerCase());
      }
    }
  });

  // Apply search if searchField and searchTerm are provided
  if (searchField && searchTerm && searchTerm.trim() !== "") {
    query = query.ilike(searchField, `%${searchTerm.trim().toLowerCase()}%`);
  }

  // Apply ordering
  // if (orderByField) {
  //   query = query.order(orderByField, { ascending: orderDirection === "asc" });
  // }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  // Execute the query
  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    items: data,
    totalItems: count,
    currentPage: page,
    totalPages: Math.ceil(count / pageSize),
    pageSize,
  });
}

export async function GET() {
  return NextResponse.json(
    { message: "This endpoint only supports POST requests" },
    { status: 405 }
  );
}
