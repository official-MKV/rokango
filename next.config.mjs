/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://rokango.ng",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
  // async middleware(req) {
  //   const { pathname, host } = req.nextUrl;

  //   // Check if we're on the app subdomain
  //   const isAppSubdomain = host.startsWith("app.");

  //   // Redirect logic for production
  //   if (process.env.NODE_ENV === "production") {
  //     // If trying to access app routes from main domain, redirect to app subdomain
  //     if (!isAppSubdomain && pathname.startsWith("/app")) {
  //       return Response.redirect(
  //         `https://app.${process.env.BASE_DOMAIN}${pathname}`
  //       );
  //     }

  //     // If trying to access landing routes from app subdomain, redirect to main domain
  //     if (isAppSubdomain && !pathname.startsWith("/app")) {
  //       return Response.redirect(
  //         `https://${process.env.BASE_DOMAIN}${pathname}`
  //       );
  //     }
  //   }

  //   // For development
  //   if (process.env.NODE_ENV === "development") {
  //     // Simulate subdomain behavior in development
  //     if (host === "localhost:3000" && pathname.startsWith("/app")) {
  //       return Response.redirect(`http://app.localhost:3000${pathname}`);
  //     }

  //     if (host === "app.localhost:3000" && !pathname.startsWith("/app")) {
  //       return Response.redirect(`http://localhost:3000${pathname}`);
  //     }
  //   }
  // },
};

export default nextConfig;
