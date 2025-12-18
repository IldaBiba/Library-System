const User = require("../models/User");
const Book = require("../models/Book");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');

const AdminController = {

  createUser: async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      User.findByEmail(email, async (err, existingUser) => {
        if (err) {
          return res.status(500).json({
            message: "Error checking existing user",
            error: err,
          });
        }

        if (existingUser) {
          return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
          name,
          email,
          password: hashedPassword,
          role,
        };

        User.create(newUser, (err, createdUser) => {
          if (err) {
            return res.status(500).json({
              message: "Error creating user",
              error: err,
            });
          }

          res.status(201).json({
            message: "User created successfully",
            user: createdUser,
          });
        });
      });
    } catch (err) {
      res.status(500).json({
        message: "Server error",
        error: err,
      });
    }
  },

  getUser: async (req, res) => {
  try {
    const { id } = req.params;

    User.findById(id, (err, user) => {
      if (err) {
        console.error("SQLITE ERROR:", err.message);
        return res
          .status(500)
          .json({ message: "Failed to fetch user", error: err });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...safeUser } = user;
      res.status(200).json({ user: safeUser });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
},

  getAllUsers: async (req, res) => {
    try {
      User.getAll((err, users) => {
        if (err) {
          console.error("SQLITE ERROR:", err.message);
          return res.status(500).json({ message: "Failed to fetch users", error: err });
        }
        res.status(200).json({ users });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    }
  },

  getAllBooks: async (req, res) => {
    try {
      Book.getAllBooks((err, books) => {
        if (err) {
          console.error(" SQLITE ERROR:", err.message);
          return res.status(500).json({ message: "Failed to fetch books", error: err });
        }
        res.status(200).json({ books });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    }
  },

   deleteUser: (req, res) => {
    const { id } = req.params;

    User.delete(id, (err, changes) => {
      if (err) return res.status(500).json({ message: 'Error deleting user', error: err });
      if (!changes) return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ message: 'User deleted successfully' });
    });
  },

  updateUser: (req, res) => {
  const { id } = req.params;

  User.update(id, req.body, (err, changes) => {
    if (err)
      return res.status(500).json({ message: "Error updating user", error: err });

    if (!changes)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully" });
  });
},

 getUserBooks : (req, res) => {
  try {
    const { id } = req.params; 

    Book.getAllByUser(id, (err, books) => {
      if (err) {
        console.error("SQLITE ERROR:", err.message);
        return res
          .status(500)
          .json({ message: "Failed to fetch user books", error: err });
      }

      
      res.status(200).json({ books });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
},

aiQuery: (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      type: "text",
      answer: "Question is required",
    });
  }

  const q = question.toLowerCase();

  // 1️⃣ Who owns the most books
  if (q.includes("most books")) {
    const sql = `
      SELECT u.name, COUNT(b.id) AS total_books
      FROM users u
      JOIN books b ON b.user_id = u.id
      GROUP BY u.id
      ORDER BY total_books DESC
      LIMIT 1
    `;

    return db.get(sql, [], (err, row) => {
      if (err) {
        console.error("SQLITE ERROR:", err.message);
        return res.status(500).json({
          type: "text",
          answer: "Query failed",
        });
      }

      if (!row) {
        return res.status(200).json({
          type: "text",
          answer: "No data available",
        });
      }

      res.status(200).json({
        type: "text",
        answer: `${row.name} owns the most books (${row.total_books})`,
      });
    });
  }

  // 2️⃣ Most popular book
  if (q.includes("most popular")) {
    const sql = `
      SELECT title, COUNT(*) AS copies
      FROM books
      GROUP BY title
      ORDER BY copies DESC
      LIMIT 1
    `;

    return db.get(sql, [], (err, row) => {
      if (err) {
        console.error("SQLITE ERROR:", err.message);
        return res.status(500).json({
          type: "text",
          answer: "Query failed",
        });
      }

      if (!row) {
        return res.status(200).json({
          type: "text",
          answer: "No data available",
        });
      }

      res.status(200).json({
        type: "text",
        answer: `"${row.title}" is the most popular book (${row.copies} copies)`,
      });
    });
  }

  // 3️⃣ Latest books
  if (q.includes("latest") || q.includes("recent")) {
    const sql = `
      SELECT title, author, genre, created_at
      FROM books
      ORDER BY created_at DESC
      LIMIT 5
    `;

    return db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("SQLITE ERROR:", err.message);
        return res.status(500).json({
          type: "text",
          answer: "Query failed",
        });
      }

      res.status(200).json({
        type: "table",
        columns: ["Title", "Author", "Genre", "Created At"],
        rows: rows.map((r) => [
          r.title,
          r.author,
          r.genre,
          r.created_at,
        ]),
      });
    });
  }

  // ❓ Unknown question
  res.status(200).json({
    type: "text",
    answer: "I cannot understand this question yet.",
  });
},



};

module.exports = AdminController;
