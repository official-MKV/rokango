import { NextResponse } from "next/server";

// Add routes that should be public on the app subdomain
const publicRoutes = [
  "/app", // app subdomain home page
  "/app/login", // login page
  "/app/signup", // if you have a signup page
  "/app/reset-password", // if you have a reset password page
];

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const isAppSubdomain = host.startsWith("app.");

  // Skip middleware for static files and API routes
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/static/") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Handle app subdomain
  if (isAppSubdomain) {
    // If already has /app prefix, just continue
    if (url.pathname.startsWith("/app")) {
      return NextResponse.next();
    }

    // Handle root path and other paths
    if (url.pathname === "/") {
      url.pathname = "/app";
    } else {
      url.pathname = `/app${url.pathname}`;
    }

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|static/|api/|.*\\.).*)"],
};
