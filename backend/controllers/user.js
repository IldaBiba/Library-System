const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { SECRET_KEY } = require('../middleware/auth');

const UserController = {
    register: async (req, res) => {
        const { name, email, password } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            name: name,
            email: email,
            password: hashedPassword,
            role: 'admin'
        };

        try {
            User.findByEmail(email, (err, existingUser) => {
                if (err) return res.status(500).json({ message: 'Error checking existing user', error: err });
                if (existingUser) return res.status(400).json({ message: 'Email already in use' });

                User.create(newUser, (err, createdUser) => {
                    if (err) return res.status(500).json({ message: 'Error creating user', error: err });
                    res.status(201).json({ message: 'User created successfully', user: createdUser });
                });

               
            });
        } catch (err) {
            res.status(500).json({ message: err.message, error: err });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        console.log(email,password)
        try {
            User.findByEmail(email, async (err, user) => {
                if (err) return res.status(500).json({ message: 'Error retrieving user', error: err });
                if (!user) return res.status(404).json({ message: 'User not found' });

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

                const token = jwt.sign(
                    { id: user.id, role: user.role, email: user.email },
                    SECRET_KEY,
                    { expiresIn: "1h" }
                );

                res.status(200).json({ message: 'Signin successful', user, token });
            });
        } catch (err) {
            res.status(500).json({ message: 'Error during signin', error: err });
        }
    },

    getMe: (req, res) => {
    try {
      const user = req.user; 
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { id, name, email, role } = user;
      res.status(200).json({ user: { id, name, email, role } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    }
  },


  
}

module.exports = UserController;
