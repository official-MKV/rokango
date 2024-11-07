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

  // Create initial query
  let query = supabase.from(tableName).select("*", { count: "exact" });

  // Apply joins for related tables
  if (relations.length > 0) {
    const relatedSelects = relations.map(
      (rel) => `${rel.field} (${rel.table} (id, name, slug, image))`
    );
    query = query.select(`*, ${relatedSelects.join(", ")}`, { count: "exact" });
  }

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        query = query.contains(key, value);
      } else {
        query = query.eq(key, value);
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
