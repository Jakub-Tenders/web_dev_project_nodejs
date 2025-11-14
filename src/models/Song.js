import db from '../config/database.js';

class Song {
  static tableName = 'songs';

  static createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        album TEXT,
        duration INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    db.exec(sql);
    console.log(`✅ Table '${this.tableName}' created/verified`);
  }

  static findAll() {
    return db.prepare(`SELECT * FROM ${this.tableName} ORDER BY id`).all();
  }

  static findById(id) {
    return db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`).get(id);
  }

  static findByTitle(title) {
    return db.prepare(`SELECT * FROM ${this.tableName} WHERE title = ?`).get(title);
  }

  static findByArtist(artist) {
    return db.prepare(`SELECT * FROM ${this.tableName} WHERE artist = ?`).all(artist);
  }

  static create({ title, artist, album, duration }) {
    const stmt = db.prepare(
      `INSERT INTO ${this.tableName} (title, artist, album, duration) VALUES (?, ?, ?, ?)`
    );
    const res = stmt.run(title, artist, album || null, duration || null);
    return this.findById(res.lastInsertRowid);
  }

  static update(id, { title, artist, album, duration }) {
    const updates = [];
    const values = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (artist !== undefined) {
      updates.push('artist = ?');
      values.push(artist);
    }
    if (album !== undefined) {
      updates.push('album = ?');
      values.push(album);
    }
    if (duration !== undefined) {
      updates.push('duration = ?');
      values.push(duration);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    if (updates.length === 1) {
      return this.findById(id);
    }
    
    values.push(id);
    db.prepare(
      `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`
    ).run(...values);
    
    return this.findById(id);
  }

  static delete(id) {
    const res = db.prepare(
      `DELETE FROM ${this.tableName} WHERE id = ?`
    ).run(id);
    return res.changes > 0;
  }

  static count() {
    return db.prepare(
      `SELECT COUNT(*) AS count FROM ${this.tableName}`
    ).get().count;
  }

  static seed() {
    if (this.count() > 0) return;
    console.log('📝 Seeding songs table...');
    [
      { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: 354 },
      { title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', duration: 482 },
      { title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', duration: 391 },
      { title: 'Imagine', artist: 'John Lennon', album: 'Imagine', duration: 183 }
    ].forEach(s => this.create(s));
    console.log('✅ Seed complete');
  }
}

export default Song;