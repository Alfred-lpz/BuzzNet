const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('buzznet.db');

db.serialize(() => {
  // Create a table for posts
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    image_path TEXT,
    user_ip TEXT
  )`);
});

db.close();
