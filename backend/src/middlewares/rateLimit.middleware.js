import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import Redis from "ioredis";
import { env, isTest } from "../config/env.js";
import { logger } from "../config/logger.js";
import { ApiError } from "../utils/apiError.js";

/**
 * Rate limit counters live in Redis when it is configured, so limits hold
 * across every instance behind the load balancer. Without REDIS_URL the
 * in-memory store applies, which is per-process and fine for local work.
 */
let store;

if (env.REDIS_URL && !isTest) {
  const client = new Redis(env.REDIS_URL, { enableOfflineQueue: false });
  client.on("error", (err) =>
    logger.error({ err }, "redis error; rate limiting degraded"),
  );
  store = new RedisStore({
    sendCommand: (...args) => client.call(...args),
    prefix: "rl:",
  });
} else {
  logger.warn("REDIS_URL not set; rate limits are per-process only");
}

function build({ windowMs, limit, message, keyGenerator }) {
  return rateLimit({
    windowMs,
    limit,
    store,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator,
    skip: () => isTest,
    handler: (_req, _res, next) => next(ApiError.tooManyRequests(message)),
  });
}

/** Broad protection for the whole API surface. */
export const globalLimiter = build({
  windowMs: 15 * 60_000,
  limit: 300,
  message: "Too many requests. Try again shortly.",
});

/**
 * Login codes cost money to send and are the obvious brute-force target, so
 * they are limited per email address rather than per IP.
 */
export const otpRequestLimiter = build({
  windowMs: 15 * 60_000,
  limit: 5,
  message: "Too many codes requested for this address. Try again later.",
  keyGenerator: (req) =>
    req.body?.email
      ? `otp:${String(req.body.email).toLowerCase()}`
      : ipKeyGenerator(req.ip),
});

export const otpVerifyLimiter = build({
  windowMs: 15 * 60_000,
  limit: 10,
  message: "Too many verification attempts. Try again later.",
  keyGenerator: (req) =>
    req.body?.email
      ? `otpv:${String(req.body.email).toLowerCase()}`
      : ipKeyGenerator(req.ip),
});
