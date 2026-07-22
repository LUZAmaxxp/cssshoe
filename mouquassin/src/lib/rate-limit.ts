const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 60, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetAt: number } {
  const { maxRequests, windowMs, keyPrefix = "global" } = config;
  const key = `${keyPrefix}:${identifier}`;
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}

export function getRateLimitHeaders(
  result: { remaining: number; resetAt: number },
  maxRequests: number
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(maxRequests),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}

// Pre-configured rate limiters for different route types
export const rateLimiters = {
  // General API: 60 requests per minute
  api: (ip: string) =>
    rateLimit(ip, { maxRequests: 60, windowMs: 60000, keyPrefix: "api" }),

  // Auth endpoints: 10 attempts per 15 minutes
  auth: (ip: string) =>
    rateLimit(ip, { maxRequests: 10, windowMs: 15 * 60000, keyPrefix: "auth" }),

  // Upload: 20 per minute
  upload: (ip: string) =>
    rateLimit(ip, { maxRequests: 20, windowMs: 60000, keyPrefix: "upload" }),

  // Orders: 10 per minute
  orders: (ip: string) =>
    rateLimit(ip, { maxRequests: 10, windowMs: 60000, keyPrefix: "orders" }),

  // Like: 30 per minute
  like: (ip: string) =>
    rateLimit(ip, { maxRequests: 30, windowMs: 60000, keyPrefix: "like" }),
};

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
