// routes/index.js
const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

// Home page
router.get('/', async (req, res) => {
  try {
    // Get counts of books and authors
    const bookCount = await Book.countDocuments();
    const authorCount = await Author.countDocuments();
    
    res.render('index', { 
      title: 'Library Home', 
      book_count: bookCount, 
      author_count: authorCount 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

module.exports = router;