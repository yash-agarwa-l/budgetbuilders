import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import sequelize from '../db/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

const modelFiles = fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'));

for (const file of modelFiles) {
  try {
    const module = await import(path.join(__dirname, file));
    const model = module.default(sequelize); 
    db[model.name] = model;
  } catch (error) {
    console.error(`Error loading model ${file}:`, error);
  }
}

Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;