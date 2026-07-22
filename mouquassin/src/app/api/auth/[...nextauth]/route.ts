import { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";
import { rateLimiters, getClientIp, getRateLimitHeaders } from "@/lib/rate-limit";

const authHandlers = handlers;

// Wrap POST with rate limiting for login attempts
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const result = rateLimiters.auth(ip);
  if (!result.allowed) {
    return Response.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429, headers: getRateLimitHeaders(result, 10) }
    );
  }

  return authHandlers.POST(request);
}

export async function GET(request: NextRequest) {
  return authHandlers.GET(request);
}
