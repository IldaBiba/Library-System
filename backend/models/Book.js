const db = require('../utils/db');

const Book = {
  create: (book, callback) => {
    const { title, author, genre, reading_status, user_id } = book;
    const sql = `
      INSERT INTO books (title, author, genre, reading_status, user_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(sql, [title, author, genre, reading_status || "want-to-read", user_id], function(err) {
      callback(err, this ? { id: this.lastID, ...book } : null);
    });
  },

  findById: (id, callback) => {
    const sql = `SELECT * FROM books WHERE id = ?`;
    db.get(sql, [id], (err, row) => callback(err, row));
  },

  getAllByUser: (user_id, callback) => {
    const sql = `SELECT * FROM books WHERE user_id = ?`;
    db.all(sql, [user_id], (err, rows) => callback(err, rows));
  },

  update: (id, book, callback) => {
    const { title, author, genre, reading_status } = book;
    const sql = `
      UPDATE books
      SET title = ?, author = ?, genre = ?, reading_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    db.run(sql, [title, author, genre, reading_status, id], function(err) {
      callback(err, this.changes);
    });
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM books WHERE id = ?`;
    db.run(sql, [id], function(err) {
      callback(err, this.changes);
    });
  },
};

module.exports = Book;