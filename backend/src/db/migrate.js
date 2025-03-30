import path from "node:path";
import { fileURLToPath } from "node:url";
import { Umzug, SequelizeStorage } from "umzug";
import sequelize from "./db.js";
import { logger } from "../config/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const migrator = new Umzug({
  migrations: {
    glob: ["migrations/*.js", { cwd: __dirname }],
    resolve({ name, path: filepath, context }) {
      return {
        name,
        async up() {
          const migration = await import(filepath);
          return migration.up({ context });
        },
        async down() {
          const migration = await import(filepath);
          return migration.down({ context });
        },
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: "schema_migrations" }),
  logger,
});

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const command = process.argv[2] ?? "up";

  try {
    if (command === "up") {
      const applied = await migrator.up();
      logger.info(
        { count: applied.length, migrations: applied.map((m) => m.name) },
        "migrations applied",
      );
    } else if (command === "down") {
      const reverted = await migrator.down();
      logger.info(
        { migrations: reverted.map((m) => m.name) },
        "migration reverted",
      );
    } else if (command === "pending") {
      const pending = await migrator.pending();
      logger.info({ migrations: pending.map((m) => m.name) }, "pending");
    } else {
      throw new Error(`Unknown command: ${command}`);
    }
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, "migration failed");
    await sequelize.close();
    process.exit(1);
  }
}
