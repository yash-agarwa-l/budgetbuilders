import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { isProduction } from "../config/env.js";
import db from "../models/index.js";
import { requestOtp, verifyOtp } from "../services/otp.service.js";
import {
  issueTokens,
  rotateTokens,
  revokeToken,
  revokeAllForUser,
} from "../services/token.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
};

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    is_details: user.is_details,
    created_at: user.created_at,
  };
}

/**
 * Step one of login: mail a one-time code. The response is deliberately
 * identical whether or not the address has an account, so this endpoint
 * cannot be used to enumerate registered users.
 */
export const sendOtp = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  await requestOtp(email, role);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "If that address is valid, a code has been sent"),
    );
});

/**
 * Step two: exchange the code for tokens, creating the account on first login.
 */
export const verifyOtpAndLogin = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const record = await verifyOtp(email, otp);

  const { user, tokens, created } = await db.sequelize.transaction(
    async (transaction) => {
      let account = await db.User.findOne({ where: { email }, transaction });
      let isNew = false;

      if (!account) {
        if (!record.role) {
          throw ApiError.badRequest(
            "A role is required when signing up. Request a new code with a role.",
          );
        }
        account = await db.User.create(
          { email, role: record.role, email_verified_at: new Date() },
          { transaction },
        );
        isNew = true;
      } else if (!account.email_verified_at) {
        await account.update({ email_verified_at: new Date() }, { transaction });
      }

      const issued = await issueTokens(account, { transaction });
      return { user: account, tokens: issued, created: isNew };
    },
  );

  return res
    .status(created ? 201 : 200)
    .cookie("accessToken", tokens.accessToken, cookieOptions)
    .cookie("refreshToken", tokens.refreshToken, cookieOptions)
    .json(
      new ApiResponse(created ? 201 : 200, "Signed in successfully", {
        ...tokens,
        user: publicUser(user),
      }),
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const presented = req.cookies?.refreshToken ?? req.body?.refreshToken;

  if (!presented) {
    throw ApiError.unauthorized("A refresh token is required");
  }

  const { tokens, user } = await rotateTokens(presented);

  return res
    .status(200)
    .cookie("accessToken", tokens.accessToken, cookieOptions)
    .cookie("refreshToken", tokens.refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, "Session refreshed", {
        ...tokens,
        user: publicUser(user),
      }),
    );
});

export const logout = asyncHandler(async (req, res) => {
  const presented = req.cookies?.refreshToken ?? req.body?.refreshToken;

  if (presented) {
    await revokeToken(presented);
  }

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, "Signed out"));
});

/** Ends every active session for the caller, on all devices. */
export const logoutAll = asyncHandler(async (req, res) => {
  await revokeAllForUser(req.user.id);

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, "Signed out of all devices"));
});

export const me = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "Profile retrieved", publicUser(req.user)));
});
