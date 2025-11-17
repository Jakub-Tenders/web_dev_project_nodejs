import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const dbPath = path.isAbsolute(config.databaseUrl)
  ? config.databaseUrl
  : path.join(__dirname, '../../', config.databaseUrl);

console.log(`📊 Database path: ${dbPath}`);


fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

export const initializeDatabase = async () => {
  console.log('🔧 Initializing database...');

  const User = (await import('../models/User.js')).default;
  const Song = (await import('../models/Song.js')).default;

  User.createTable();
  Song.createTable();


User.seed();
Song.seed();

  console.log('✅ Database initialization complete');
};


export default db;
