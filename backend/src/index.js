import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import sequelize, { assertDatabaseConnection } from "./db/db.js";

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, "server listening");
});

// Verify the database after binding the port so the container reports a
// listening socket immediately; /health/ready reflects the real state.
assertDatabaseConnection().catch((err) => {
  logger.error({ err }, "database unreachable at startup");
});

/**
 * Stop accepting connections, let in-flight requests finish, then close the
 * connection pool. Without this a deploy can cut requests mid-transaction.
 */
async function shutdown(signal) {
  logger.info({ signal }, "shutting down");

  const timer = setTimeout(() => {
    logger.error("graceful shutdown timed out; forcing exit");
    process.exit(1);
  }, 10_000).unref();

  server.close(async (err) => {
    if (err) {
      logger.error({ err }, "error closing server");
      process.exit(1);
    }
    try {
      await sequelize.close();
      clearTimeout(timer);
      logger.info("shutdown complete");
      process.exit(0);
    } catch (closeError) {
      logger.error({ err: closeError }, "error closing database pool");
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.fatal({ err: reason }, "unhandled rejection");
  throw reason;
});

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "uncaught exception");
  process.exit(1);
});

export { server };
