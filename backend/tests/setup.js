import { beforeAll, afterAll, beforeEach } from "vitest";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  "postgres://user:pass@localhost:55432/budgetbuilders";
process.env.ACCESS_SECRET =
  "test-access-secret-that-is-long-enough-to-pass";
process.env.REFRESH_SECRET =
  "test-refresh-secret-that-is-long-enough-to-pass";
process.env.ACCESS_EXPIRY = "15m";
process.env.MAIL_TRANSPORT = "console";
process.env.LOG_LEVEL = "fatal";

const { default: db } = await import("../src/models/index.js");
const { migrator } = await import("../src/db/migrate.js");

beforeAll(async () => {
  await migrator.up();
});

beforeEach(async () => {
  await db.sequelize.query(
    `TRUNCATE TABLE interested_builders, sub_orders, orders, builders,
     customers, refresh_tokens, email_otps, users RESTART IDENTITY CASCADE;`,
  );
});

afterAll(async () => {
  await db.sequelize.close();
});

export { db };
