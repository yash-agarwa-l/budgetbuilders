import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import db from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

/** Populates req.user from a bearer token or the accessToken cookie. */
export const verifyJWT = asyncHandler(async (req, _res, next) => {
  const header = req.header("Authorization");
  const token = header?.startsWith("Bearer ")
    ? header.slice(7).trim()
    : req.cookies?.accessToken;

  if (!token) {
    throw ApiError.unauthorized("Authentication required");
  }

  // Let JsonWebTokenError and TokenExpiredError reach the error handler,
  // which maps them to a 401 with an accurate message.
  const decoded = jwt.verify(token, env.ACCESS_SECRET);

  const user = await db.User.findByPk(decoded.sub);
  if (!user) {
    throw ApiError.unauthorized("Account no longer exists");
  }

  req.user = user;
  next();
});

/** Restricts a route to the given roles. Must run after verifyJWT. */
export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(`This action requires the ${roles.join(" or ")} role`),
      );
    }
    next();
  };
}

export const requireBuilder = requireRole("builder");
export const requireCustomer = requireRole("customer");

/**
 * Loads the Builder profile for the signed-in user and attaches it, so
 * controllers never take a builder_id from the request body — that would let
 * one builder act as another.
 */
export const attachBuilderProfile = asyncHandler(async (req, _res, next) => {
  const builder = await db.Builder.findOne({ where: { user_id: req.user.id } });

  if (!builder) {
    throw ApiError.forbidden(
      "Complete your builder profile before using this feature",
    );
  }

  req.builder = builder;
  next();
});
