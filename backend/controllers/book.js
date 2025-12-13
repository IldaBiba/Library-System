const Book = require('../models/Book');

const BookController = {
  createBook: (req, res) => {
    const { title, author, genre, reading_status } = req.body;
    const user_id = req.user.id; 
  

    const newBook = { title, author, genre, reading_status, user_id };

    console.log(newBook)

    Book.create(newBook, (err, createdBook) => {
      console.log(createdBook)
      if (err) return res.status(500).json({ message: 'Error creating book', error: err });
      res.status(201).json({ message: 'Book created successfully', book: createdBook });
    });
  },

  getBook: (req, res) => {
    const { id } = req.params;

    Book.findById(id, (err, book) => {
      if (err) return res.status(500).json({ message: 'Error retrieving book', error: err });
      if (!book) return res.status(404).json({ message: 'Book not found' });
      res.status(200).json({ book });
    });
  },

  getAllBooksByUser: (req, res) => {
    const user_id = req.user.id;

    Book.getAllByUser(user_id, (err, books) => {
      if (err) return res.status(500).json({ message: 'Error retrieving books', error: err });
      res.status(200).json(books);
    });
  },

  updateBook: (req, res) => {
    const { id } = req.params;
    const { title, author, genre, reading_status } = req.body;

    const updatedBook = { title, author, genre, reading_status };

    Book.update(id, updatedBook, (err, changes) => {
      if (err) return res.status(500).json({ message: 'Error updating book', error: err });
      if (!changes) return res.status(404).json({ message: 'Book not found or no changes made' });
      res.status(200).json({ message: 'Book updated successfully', book: { id, ...updatedBook } });
    });
  },

  deleteBook: (req, res) => {
    const { id } = req.params;

    Book.delete(id, (err, changes) => {
      if (err) return res.status(500).json({ message: 'Error deleting book', error: err });
      if (!changes) return res.status(404).json({ message: 'Book not found' });
      res.status(200).json({ message: 'Book deleted successfully' });
    });
  },
};

module.exports = BookController;
