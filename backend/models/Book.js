const db = require('../utils/db');

const Book = {

  create: (book, callback) => {
  const { title, author, genre, reading_status, user_id } = book;

  // 1️⃣ Validate required fields
  if (!title || !author || !user_id) {
    return callback(new Error("Title, author, and user_id are required."), null);
  }

  // 2️⃣ Map reading_status to valid DB values
  const validStatuses = ["reading", "completed", "want-to-read"];
  const status = validStatuses.includes(reading_status) ? reading_status : "want-to-read";

  const sql = `
    INSERT INTO books (title, author, genre, reading_status, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  // 3️⃣ Run the insert
  db.run(sql, [title, author, genre || null, status, user_id], function(err) {
    if (err) {
      console.error("❌ SQLITE INSERT ERROR:", err.message);
      return callback(err, null); // Don't try to use this.lastID if err exists
    }

    // 4️⃣ Return the newly created book with lastID
    callback(null, {
      id: this.lastID,
      title,
      author,
      genre: genre || null,
      reading_status: status,
      user_id,
    });
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

  getAllBooks: (callback) => {
    const sql = `
      SELECT b.id, b.title, b.author, b.genre, b.reading_status, b.created_at, b.updated_at,
             u.id AS user_id, u.name AS user_name, u.email AS user_email
      FROM books b
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `;
    db.all(sql, [], (err, rows) => callback(err, rows));
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