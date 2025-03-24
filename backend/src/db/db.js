import { Sequelize } from "sequelize";
import { env, isTest } from "../config/env.js";
import { logger } from "../config/logger.js";

const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: "postgres",
  logging: isTest ? false : (sql) => logger.debug({ sql }, "sequelize"),
  dialectOptions: env.DATABASE_SSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true,
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
});

export async function assertDatabaseConnection() {
  await sequelize.authenticate();
  logger.info("database connection established");
}

export default sequelize;
