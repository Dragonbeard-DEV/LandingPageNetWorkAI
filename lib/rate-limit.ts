// Simple fixed-window rate limiter kept in memory.
// Limitation: each server instance (and each serverless cold start) has its own counter,
// so on Vercel this is best-effort. Use a shared store (e.g. Upstash Redis) for strict limits.

type Bucket = { count: number; resetAt: number };

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

type Options = {
  limit: number;
  windowMs: number;
  /** Upper bound on tracked keys; when full, unknown keys are refused instead of growing memory. */
  maxKeys?: number;
};

const SWEEP_INTERVAL_MS = 60_000;

export function createRateLimiter({ limit, windowMs, maxKeys = 10_000 }: Options) {
  const buckets = new Map<string, Bucket>();
  let lastSweep = 0;

  function sweep(now: number) {
    if (now - lastSweep < SWEEP_INTERVAL_MS) return;
    lastSweep = now;
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  return function check(key: string, now: number = Date.now()): RateLimitResult {
    sweep(now);
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      if (!current && buckets.size >= maxKeys) {
        return { allowed: false, retryAfterSeconds: Math.ceil(windowMs / 1000) };
      }
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
