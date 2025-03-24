import pino from "pino";
import { env, isProduction } from "./env.js";

/**
 * Structured logger. Pretty output is intentionally left to the developer's
 * own tooling (`npm run dev | pino-pretty`) so production stays pure JSON.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: "budgetbuilder-api" },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
      "*.password",
      "*.otp",
      "*.token",
      "*.refreshToken",
      "*.accessToken",
    ],
    censor: "[redacted]",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(isProduction ? {} : { transport: undefined }),
});
