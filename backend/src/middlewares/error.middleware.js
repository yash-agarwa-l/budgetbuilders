import { ZodError } from "zod";
import { BaseError, ValidationError, UniqueConstraintError } from "sequelize";
import { ApiError } from "../utils/apiError.js";
import { isProduction } from "../config/env.js";
import { logger } from "../config/logger.js";

/**
 * Translates the error vocabularies we actually throw (Zod, Sequelize, JWT)
 * into a single ApiError so the client sees one consistent shape.
 */
function normalize(error) {
  if (error instanceof ApiError) return error;

  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join(".") || "(root)",
      message: issue.message,
    }));
    return new ApiError(400, "Validation failed", details);
  }

  if (error instanceof UniqueConstraintError) {
    const field = error.errors?.[0]?.path ?? "value";
    return new ApiError(409, `A record with this ${field} already exists`);
  }

  if (error instanceof ValidationError) {
    const details = error.errors.map((item) => ({
      field: item.path,
      message: item.message,
    }));
    return new ApiError(400, "Validation failed", details);
  }

  if (error?.name === "JsonWebTokenError") {
    return ApiError.unauthorized("Invalid token");
  }

  if (error?.name === "TokenExpiredError") {
    return ApiError.unauthorized("Token expired");
  }

  // Any other Sequelize fault is a database problem, not a client mistake.
  if (error instanceof BaseError) {
    return new ApiError(500, "Database error");
  }

  return new ApiError(500, error?.message || "Internal server error");
}

export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(err, req, res, _next) {
  const error = normalize(err);

  const log = req.log ?? logger;
  const payload = {
    statusCode: error.statusCode,
    path: req.originalUrl,
    method: req.method,
  };

  if (error.statusCode >= 500) {
    log.error({ ...payload, err }, error.message);
  } else {
    log.warn(payload, error.message);
  }

  // A 500 means we did something wrong; never surface the raw reason.
  const message =
    error.statusCode >= 500 && isProduction
      ? "Internal server error"
      : error.message;

  res.status(error.statusCode).json({
    statusCode: error.statusCode,
    success: false,
    message,
    ...(error.errors?.length ? { errors: error.errors } : {}),
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
