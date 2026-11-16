type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const globalRateLimit = globalThis as typeof globalThis & {
  contactRateLimits?: Map<string, RateLimitEntry>;
};

const entries = globalRateLimit.contactRateLimits ?? new Map<string, RateLimitEntry>();
globalRateLimit.contactRateLimits = entries;

export function checkContactRateLimit(key: string) {
  const now = Date.now();
  const current = entries.get(key);

  if (!current || current.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
