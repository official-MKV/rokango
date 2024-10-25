import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host");

  // Check if the request is from app.domain.com
  if (host.startsWith("app.")) {
    // Redirect or rewrite to the app section
    return NextResponse.rewrite(new URL("/app", req.url));
  }

  // Default behavior for the main landing page (domain.com)
  return NextResponse.next();
}
