const sqlite3 = require("sqlite3").verbose();
const path = require("path");


const dbPath = path.resolve(__dirname, "../library.db");

console.log("Database file:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB error:", err.message);
  } else {
    console.log("Connected to SQLite!");
  }
});


db.run("PRAGMA foreign_keys = ON;");


db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT,
    reading_status TEXT CHECK (reading_status IN ('reading', 'completed', 'want-to-read'))
                   DEFAULT 'want-to-read',
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

module.exports = db;
