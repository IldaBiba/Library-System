const User = require("../models/User");
const Book = require("../models/Book");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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



};

module.exports = AdminController;
