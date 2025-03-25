import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import Sequelize from "sequelize";
import sequelize from "../db/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = {};

const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".model.js"))
  .sort();

for (const file of modelFiles) {
  // A model that fails to load must crash the process. Swallowing the error
  // here previously left db.X undefined and surfaced as a confusing 500 on
  // the first request that touched it.
  const module = await import(pathToFileURL(path.join(__dirname, file)).href);

  if (typeof module.default !== "function") {
    throw new Error(`Model ${file} must export a default factory function`);
  }

  const model = module.default(sequelize);
  db[model.name] = model;
}

for (const model of Object.values(db)) {
  if (typeof model.associate === "function") {
    model.associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
