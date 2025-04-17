// routes/books.js
const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const { body, validationResult } = require('express-validator');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    res.render('book_list', { title: 'Book List', books });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching books');
  }
});

// Display book create form
router.get('/create', async (req, res) => {
  try {
    const authors = await Author.find();
    res.render('book_form', { title: 'Create Book', authors });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching authors');
  }
});

// Handle book create
router.post('/create', [
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Title must be specified'),
  body('author').escape(),
  body('summary').trim().isLength({ min: 1 }).escape().withMessage('Summary must be specified'),
  body('isbn').trim().isLength({ min: 1 }).escape().withMessage('ISBN must be specified'),
  body('published_year').optional({ checkFalsy: true }).isInt().withMessage('Published year must be a number'),
  
  async (req, res) => {
    const errors = validationResult(req);
    
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      published_year: req.body.published_year
    });
    
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages
      const authors = await Author.find();
      res.render('book_form', { 
        title: 'Create Book', 
        authors, 
        book, 
        errors: errors.array() 
      });
      return;
    } else {
      // Data is valid
      await book.save();
      res.redirect('/books');
    }
  }
]);

// Display book detail
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    if (!book) {
      res.status(404).send('Book not found');
      return;
    }
    res.render('book_detail', { title: book.title, book });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching book');
  }
});

module.exports = router;