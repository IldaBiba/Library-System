const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

const { authenticate, authorizeAdmin } = require('../middleware/auth');
const AdminController = require('../controllers/admin');


router.post('/create-user', authenticate, authorizeAdmin, AdminController.createUser)
router.get('/get-all-books',authenticate, authorizeAdmin, AdminController.getAllBooks);
router.get('/get-all-users',authenticate, authorizeAdmin, AdminController.getAllUsers);
router.delete('/delete-user/:id',authenticate, authorizeAdmin, AdminController.deleteUser);
router.put(
  "/update-user/:id",
  authenticate,
  authorizeAdmin,
  AdminController.updateUser
);
router.get('/get-user/:id',authenticate, authorizeAdmin, AdminController.getUser);
router.get('/user-books/:id',authenticate, authorizeAdmin, AdminController.getUserBooks);
router.post("/ai-query", authenticate, authorizeAdmin, AdminController.aiQuery);

module.exports = router;