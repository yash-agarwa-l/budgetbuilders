import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("A valid email address is required");

export const requestOtpSchema = z.object({
  email,
  role: z.enum(["customer", "builder", "worker"]).optional(),
});

export const verifyOtpSchema = z.object({
  email,
  otp: z
    .string()
    .trim()
    .regex(/^\d{4,8}$/, "The code must be 4 to 8 digits"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});
