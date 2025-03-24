import { z } from "zod";

/**
 * Environment schema. The process refuses to boot unless every required
 * variable is present and well formed, so a missing secret surfaces here
 * rather than as a 500 on the first request that happens to need it.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection URL"),
  DATABASE_SSL: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),

  REDIS_URL: z.string().url().optional(),

  ACCESS_SECRET: z
    .string()
    .min(32, "ACCESS_SECRET must be at least 32 characters"),
  REFRESH_SECRET: z
    .string()
    .min(32, "REFRESH_SECRET must be at least 32 characters"),
  ACCESS_EXPIRY: z.string().default("15m"),
  REFRESH_EXPIRY: z.string().default("30d"),

  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),

  OTP_LENGTH: z.coerce.number().int().min(4).max(8).default(6),
  OTP_TTL_MINUTES: z.coerce.number().int().positive().default(10),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),

  MAIL_TRANSPORT: z.enum(["console", "smtp"]).default("console"),
  MAIL_FROM: z.string().default("BudgetBuilders <no-reply@budgetbuilders.in>"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${details}`);
}

export const env = parsed.data;

// SMTP transport needs its connection details; fail at boot rather than on
// the first mail we try to send.
if (env.MAIL_TRANSPORT === "smtp" && !env.SMTP_HOST) {
  throw new Error("SMTP_HOST is required when MAIL_TRANSPORT is 'smtp'");
}

export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
