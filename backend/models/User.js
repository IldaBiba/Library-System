const db = require("../utils/db");
const User = {
  create: (user, callback) => {
    const { name, email, password, role } = user;
    const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, email, password, role || "user"], function(err) {
      callback(err, this ? { id: this.lastID, ...user } : null);
    });
  },

  findById: (id, callback) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.get(sql, [id], (err, row) => callback(err, row));
  },

  findByEmail: (email, callback) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], (err, row) => callback(err, row));
  },

  getAll: (callback) => {
    const sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => callback(err, rows));
  },

  update: (id, user, callback) => {
  const { name, email, role } = user;

  const sql = `
    UPDATE users
    SET name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(sql, [name, email, role, id], function (err) {
    callback(err, this.changes);
  });
},

  delete: (id, callback) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.run(sql, [id], function(err) {
      callback(err, this.changes);
    });
  },
};

module.exports = User;