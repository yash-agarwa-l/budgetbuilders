import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import crypto from "node:crypto";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { globalLimiter } from "./middlewares/rateLimit.middleware.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";

import authRouter from "./routes/auth.route.js";
import healthRouter from "./routes/health.route.js";

const app = express();

// Correct client IPs behind a proxy, which the rate limiter depends on.
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      // Same-origin and server-to-server calls arrive without an Origin.
      if (!origin || env.CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-request-id"] ?? crypto.randomUUID(),
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
  }),
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

app.use("/health", healthRouter);

app.use("/api", globalLimiter);
app.use("/api/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
