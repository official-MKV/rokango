import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ROLE_KEY
);

export async function POST(request) {
  try {
    const {
      tableName,
      filters = {},
      page = 1,
      pageSize = 10,
      searchField,
      searchTerm,
      orderByField,
      orderDirection = "asc",
      relations = [],
    } = await request.json();

    console.log("Received parameters:", {
      tableName,
      filters,
      page,
      pageSize,
      searchField,
      searchTerm,
      orderByField,
      orderDirection,
      relations,
    });
    let productIds = [];
    if (filters.category && relations.includes("product_categories")) {
      // Check if filters.category is a slug or an ID
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

    // Apply the product ID filter if productIds array is populated
    if (productIds.length > 0) {
      query = query.in("id", productIds);
    }

    let query = supabase.from(tableName).select("*", { count: "exact" });

    // Handle supplier.id filter for JSONB column
    if (filters["supplier.id"]) {
      console.log(
        "Applying supplier.id filter with supplier ID:",
        filters["supplier.id"]
      );
      query = query.eq("supplier->>id", filters["supplier.id"]);
      delete filters["supplier.id"];
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        console.log(`Applying filter: ${key} = ${value}`);
        if (Array.isArray(value)) {
          query = query.contains(key, value);
        } else if (typeof value === "string") {
          query = query.ilike(key, `%${value.toLowerCase()}%`);
        } else {
          query = query.eq(key, value);
        }
      }
    });

    // Apply search
    if (searchField && searchTerm && searchTerm.trim() !== "") {
      console.log(
        `Applying search: ${searchField} ilike %${searchTerm
          .trim()
          .toLowerCase()}%`
      );
      query = query.ilike(searchField, `%${searchTerm.trim().toLowerCase()}%`);
    }

    // Apply ordering
    // if (orderByField) {
    //   console.log(`Applying ordering: ${orderByField} ${orderDirection}`);
    //   query = query.order(orderByField, { ascending: orderDirection === "asc" });
    // }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    console.log(`Applying pagination: from ${from} to ${to}`);
    query = query.range(from, to);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      console.error("Query execution error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Query executed successfully. Data count:", count);
    return NextResponse.json({
      items: data,
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / pageSize),
      pageSize,
    });
  } catch (err) {
    console.error("Unexpected error in POST request:", err.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "This endpoint only supports POST requests" },
    { status: 405 }
  );
}
