// Simple fixed-window rate limiter kept in memory.
// Limitation: each server instance (and each serverless cold start) has its own counter,
// so on Vercel this is best-effort. Use a shared store (e.g. Upstash Redis) for strict limits.

type Bucket = { count: number; resetAt: number };

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();

  return function check(key: string, now: number = Date.now()): RateLimitResult {
    // Drop expired buckets so the map cannot grow without bound.
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }

    const current = buckets.get(key);
    if (!current) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }
    if (current.count >= limit) {
      return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
    }
    buckets.set(key, { ...current, count: current.count + 1 });
    return { allowed: true, retryAfterSeconds: 0 };
  };
}
