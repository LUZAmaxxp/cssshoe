import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  "https://lyzane.vercel.app",
];

const corsHeaders = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  return allowedOrigins.some(
    (allowed) => origin === allowed || origin.endsWith(new URL(allowed).hostname)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    if (pathname.startsWith("/api/")) {
      const response = new NextResponse(null, { status: 204 });
      if (isAllowedOrigin(origin)) {
        response.headers.set("Access-Control-Allow-Origin", origin || "*");
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      }
      return response;
    }
  }

  // Admin auth check
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/admin/login" && sessionToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const response = NextResponse.next();

  // Add CORS headers to API responses
  if (pathname.startsWith("/api/")) {
    if (isAllowedOrigin(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin || "*");
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
