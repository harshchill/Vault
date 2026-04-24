import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const RATE_LIMIT_POLICIES = {
  paperUpload: { limit: 5, window: "10 m" },
  paperModeration: { limit: 30, window: "10 m" },
  paperSearch: { limit: 20, window: "60 s" },
};

const getRedisClient = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN"
      );
    }
    return null;
  }

  if (!globalThis.__upstashRedisClient) {
    globalThis.__upstashRedisClient = new Redis({ url, token });
  }

  return globalThis.__upstashRedisClient;
};

const getPolicyLimiter = (policyName) => {
  const policy = RATE_LIMIT_POLICIES[policyName];
  if (!policy) {
    throw new Error(`Unknown rate limit policy: ${policyName}`);
  }

  const redis = getRedisClient();
  if (!redis) {
    return null;
  }

  if (!globalThis.__upstashRateLimiters) {
    globalThis.__upstashRateLimiters = {};
  }

  if (!globalThis.__upstashRateLimiters[policyName]) {
    globalThis.__upstashRateLimiters[policyName] = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(policy.limit, policy.window),
      analytics: true,
      prefix: `rl:${policyName}`,
    });
  }

  return globalThis.__upstashRateLimiters[policyName];
};

const normalizeIdentifier = (value) =>
  String(value || "anonymous")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

export const getClientIp = (request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
};

export const checkRateLimit = async ({ policyName, identifier }) => {
  const limiter = getPolicyLimiter(policyName);
  if (!limiter) {
    // Local dev fallback when env vars are intentionally absent.
    return { success: true, limit: null, remaining: null, reset: null };
  }

  const key = normalizeIdentifier(identifier);
  const result = await limiter.limit(key);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
    pending: result.pending,
  };
};

export const createRateLimitResponse = (
  result,
  message = "Too many requests. Please try again later."
) => {
  const now = Date.now();
  const retryAfterSeconds = result?.reset
    ? Math.max(1, Math.ceil((result.reset - now) / 1000))
    : 60;

  return NextResponse.json(
    {
      error: message,
      rateLimit: {
        limit: result?.limit ?? null,
        remaining: result?.remaining ?? 0,
        reset: result?.reset ?? null,
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Limit": String(result?.limit ?? ""),
        "X-RateLimit-Remaining": String(result?.remaining ?? 0),
        "X-RateLimit-Reset": String(result?.reset ?? ""),
      },
    }
  );
};
