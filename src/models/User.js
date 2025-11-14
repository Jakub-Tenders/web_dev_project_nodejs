import db from '../config/database.js';

class User {
  static tableName = 'users';

  static get dbInstance() {
    return db;
  }

  static createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    this.dbInstance.exec(sql);
    console.log(`Table '${this.tableName}' created/verified`);
  }

  static findAll() {
    const stmt = this.dbInstance.prepare(`SELECT * FROM ${this.tableName} ORDER BY id`);
    return stmt.all(); // returns all rows as array of objects
  }

  static findById(id) {
    const stmt = this.dbInstance.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`);
    return stmt.get(id) || null;
  }

  static findByEmail(email) {
    const stmt = this.dbInstance.prepare(`SELECT * FROM ${this.tableName} WHERE email = ?`);
    return stmt.get(email) || null;
  }

  static emailExists(email, excludeId = null) {
    if (!email) return false;
    let stmt;
    if (excludeId) {
      stmt = this.dbInstance.prepare(`SELECT id FROM ${this.tableName} WHERE email = ? AND id != ?`);
      return !!stmt.get(email, excludeId);
    } else {
      stmt = this.dbInstance.prepare(`SELECT id FROM ${this.tableName} WHERE email = ?`);
      return !!stmt.get(email);
    }
  }

  static create({ name, email }) {
    const stmt = this.dbInstance.prepare(
      `INSERT INTO ${this.tableName} (name, email) VALUES (?, ?)`
    );
    const info = stmt.run(name, email || null);
    return this.findById(info.lastInsertRowid);
  }

  static update(id, { name, email }) {
    const updates = [];
    const values = [];
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    updates.push('updated_at = CURRENT_TIMESTAMP');
    if (updates.length === 1) return this.findById(id); // nothing to update

    values.push(id);
    const stmt = this.dbInstance.prepare(
      `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`
    );
    stmt.run(...values);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = this.dbInstance.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    const info = stmt.run(id);
    return info.changes > 0;
  }

  static count() {
    const stmt = this.dbInstance.prepare(`SELECT COUNT(*) AS count FROM ${this.tableName}`);
    return stmt.get().count;
  }

  static seed() {
    if (this.count() > 0) return;
    console.log('Seeding users table...');
    [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
      { name: 'Charlie', email: 'charlie@example.com' },
      { name: 'Dave', email: 'dave@example.com' }
    ].forEach(u => this.create(u));
    console.log('Seed complete');
  }
}

export default User;
