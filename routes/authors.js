// routes/authors.js
const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');

// Get all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find().sort({ last_name: 1 });
    res.render('author_list', { title: 'Author List', authors });
  } catch (err) {
    res.status(500).send('Error fetching authors');
  }
});

// Display author create form
router.get('/create', (req, res) => {
  res.render('author_form', { title: 'Create Author' });
});

// Handle author create
router.post('/create', [
  body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified'),
  body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified'),
  body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),
  
  async (req, res) => {
    const errors = validationResult(req);
    
    const author = new Author({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death
    });
    
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages
      res.render('author_form', { 
        title: 'Create Author', 
        author, 
        errors: errors.array() 
      });
      return;
    } else {
      // Data is valid
      await author.save();
      res.redirect('/authors');
    }
  }
]);

// Display author detail
router.get('/:id', async (req, res) => {
  try {
    const [author, books] = await Promise.all([
      Author.findById(req.params.id),
      Book.find({ author: req.params.id })
    ]);
    
    if (!author) {
      res.status(404).send('Author not found');
      return;
    }
    
    res.render('author_detail', { 
      title: 'Author Detail', 
      author, 
      author_books: books 
    });
  } catch (err) {
    res.status(500).send('Error fetching author');
  }
});

module.exports = router;