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

    let query = supabase.from(tableName).select("*", { count: "exact" });

    // Check if we need to filter products by a specific category
    let productIds = [];
    if (filters.category) {
      const isSlug = typeof filters.category === "string";

      // Query product IDs associated with the specified category (by slug or ID)
      const { data: categoryData, error: categoryError } = await supabase
        .from("product_categories")
        .select("product, category!inner(slug, id)")
        .eq(isSlug ? "category.slug" : "category.id", filters.category);

      if (categoryError) {
        console.error("Category query error:", categoryError.message);
        return NextResponse.json(
          { error: categoryError.message },
          { status: 500 }
        );
      }

      // Extract product IDs associated with the category
      productIds = categoryData.map((item) => item.product);
      delete filters.category; // Remove category filter from main query

      // Apply the product ID filter if productIds array is populated
      if (productIds.length > 0) {
        query = query.in("id", productIds);
      }
    }

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
    //   query = query.order(orderByField, {
    //     ascending: orderDirection === "asc",
    //   });
    // }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    console.log(`Applying pagination: from ${from} to ${to}`);
    query = query.range(from, to);

    // Execute the product query
    const { data, error, count } = await query;

    if (error) {
      console.error("Query execution error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If relation includes product_categories, fetch and attach categories for each product
    if (relations.includes("product_categories")) {
      const productIdsForCategories = data.map((product) => product.id);

      const { data: allCategoryData, error: allCategoryError } = await supabase
        .from("product_categories")
        .select("product, category(id, name)")
        .in("product", productIdsForCategories);

      if (allCategoryError) {
        console.error(
          "Category data retrieval error:",
          allCategoryError.message
        );
        return NextResponse.json(
          { error: allCategoryError.message },
          { status: 500 }
        );
      }

      // Map categories to products
      const categoriesMap = allCategoryData.reduce((map, item) => {
        if (!map[item.product]) map[item.product] = [];
        map[item.product].push({
          id: item.category.id,
          name: item.category.name,
        });
        return map;
      }, {});

      // Append category information to each product
      data.forEach((product) => {
        product.categories = categoriesMap[product.id] || [];
      });
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
