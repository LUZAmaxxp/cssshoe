const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(
  key: string,
  maxRequests: number = 30,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.lastReset > windowMs) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export function getRateLimitHeaders(key: string, maxRequests: number = 30) {
  const record = rateLimitMap.get(key);
  return {
    "X-RateLimit-Limit": String(maxRequests),
    "X-RateLimit-Remaining": String(
      record ? Math.max(0, maxRequests - record.count) : maxRequests
    ),
  };
}
