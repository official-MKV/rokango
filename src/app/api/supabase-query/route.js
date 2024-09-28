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
  } = await request.json();

  let query = supabase.from(tableName).select("*", { count: "exact" });

  // Apply filters
  console.log(`filters: ${JSON.stringify(filters)}`);
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "Categories") {
        // Ensure the value is an array and use contains for the Categories array
        const categoryArray = Array.isArray(value) ? value : [value];
        console.log(`Categories:${categoryArray}`);
        query = query.contains(key, categoryArray);
      } else if (key === "active") {
        // Handle boolean values
        query = query.eq(key, value === "true" || value === true);
      } else if (key.includes(".")) {
        // Handle JSONB fields
        const [jsonField, jsonKey] = key.split(".");
        query = query.eq(`${jsonField}->>${jsonKey}`, value);
      } else {
        query = query.eq(key, value);
      }
    }
  });
  // Apply search if searchField and searchTerm are provided
  if (searchField && searchTerm && searchTerm.trim() !== "") {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    query = query.ilike(searchField, `%${trimmedSearchTerm}%`);
  }

  // Apply ordering
  //   if (orderByField) {
  //     query = query.order(orderByField, { ascending: orderDirection === "asc" });
  //   }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  // Execute the query
  const { data, error, count } = await query;
  console.log(`error:${JSON.stringify(error)}`);
  //   console.log(`data:${JSON.stringify(data)}`);
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
