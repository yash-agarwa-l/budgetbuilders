import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { env } from "../config/env.js";
import db from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import { sendOtpMail } from "./mail.service.js";

const BCRYPT_ROUNDS = 10;

function generateOtp() {
  const max = 10 ** env.OTP_LENGTH;
  const value = crypto.randomInt(0, max);
  return String(value).padStart(env.OTP_LENGTH, "0");
}

/**
 * Issues a login code for an email address. Any earlier unconsumed codes are
 * invalidated so only the most recent one works.
 */
export async function requestOtp(email, role) {
  const otp = generateOtp();

  await db.EmailOtp.destroy({
    where: { email, consumed_at: null },
  });

  await db.EmailOtp.create({
    email,
    role,
    otp_hash: await bcrypt.hash(otp, BCRYPT_ROUNDS),
    expires_at: new Date(Date.now() + env.OTP_TTL_MINUTES * 60_000),
  });

  await sendOtpMail(email, otp);
}

/**
 * Verifies a submitted code. Attempts are counted against the stored record so
 * a code cannot be brute forced even if the per-IP rate limit is evaded.
 */
export async function verifyOtp(email, otp) {
  const record = await db.EmailOtp.findOne({
    where: {
      email,
      consumed_at: null,
      expires_at: { [Op.gt]: new Date() },
    },
    order: [["created_at", "DESC"]],
  });

  if (!record) {
    throw ApiError.badRequest("No active code for this email. Request a new one.");
  }

  if (record.attempts >= env.OTP_MAX_ATTEMPTS) {
    throw ApiError.tooManyRequests(
      "Too many incorrect attempts. Request a new code.",
    );
  }

  const matches = await bcrypt.compare(otp, record.otp_hash);

  if (!matches) {
    await record.increment("attempts");
    throw ApiError.unauthorized("Incorrect code");
  }

  await record.update({ consumed_at: new Date() });
  return record;
}
