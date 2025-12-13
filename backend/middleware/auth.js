
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const SECRET_KEY = "your_secret_key_here"; 


const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only!" });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin, SECRET_KEY };
