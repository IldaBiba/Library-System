const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get("/me", authenticate, UserController.getMe);


module.exports = router;