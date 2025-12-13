const express = require('express');
const router = express.Router();
const BookController = require('../controllers/book');

const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.post('/create-book',authenticate,  BookController.createBook);

router.get('/my-books',authenticate, BookController.getAllBooksByUser);
router.get('/:id', authenticate,authenticate, BookController.getBook);
router.put('/:id', authenticate,authenticate, BookController.updateBook);
router.delete('/delete/:id', authenticate,authenticate, BookController.deleteBook);


module.exports = router;