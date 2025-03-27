import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import db from "../models/index.js";
import { ApiError } from "../utils/apiError.js";

/** Refresh tokens are opaque random strings; only their hash is persisted. */
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.ACCESS_SECRET, {
    expiresIn: env.ACCESS_EXPIRY,
  });
}

function refreshExpiryDate() {
  const match = /^(\d+)([smhd])$/.exec(env.REFRESH_EXPIRY);
  const multipliers = { s: 1e3, m: 6e4, h: 36e5, d: 864e5 };
  const duration = match
    ? Number(match[1]) * multipliers[match[2]]
    : 30 * 864e5;
  return new Date(Date.now() + duration);
}

/**
 * Issues an access/refresh pair and records the refresh token so it can be
 * revoked later.
 */
export async function issueTokens(user, { transaction } = {}) {
  const accessToken = signAccessToken(user);
  const refreshToken = crypto.randomBytes(48).toString("hex");

  await db.RefreshToken.create(
    {
      user_id: user.id,
      token_hash: hashToken(refreshToken),
      expires_at: refreshExpiryDate(),
    },
    { transaction },
  );

  return { accessToken, refreshToken };
}

/**
 * Validates a refresh token and rotates it: the presented token is revoked
 * and a fresh pair issued, so a stolen token is usable at most once.
 */
export async function rotateTokens(presentedToken) {
  const record = await db.RefreshToken.findOne({
    where: { token_hash: hashToken(presentedToken) },
  });

  if (!record || record.revoked_at || record.expires_at < new Date()) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await db.User.findByPk(record.user_id);
  if (!user) {
    throw ApiError.unauthorized("Account no longer exists");
  }

  return db.sequelize.transaction(async (transaction) => {
    await record.update({ revoked_at: new Date() }, { transaction });
    const tokens = await issueTokens(user, { transaction });
    return { tokens, user };
  });
}

export async function revokeToken(presentedToken) {
  const record = await db.RefreshToken.findOne({
    where: { token_hash: hashToken(presentedToken) },
  });
  if (record && !record.revoked_at) {
    await record.update({ revoked_at: new Date() });
  }
}

export async function revokeAllForUser(userId) {
  await db.RefreshToken.update(
    { revoked_at: new Date() },
    { where: { user_id: userId, revoked_at: null } },
  );
}
