// app.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// Create Express app
const app = express();

// Set up MongoDB connection
mongoose.connect('mongodb://localhost:27017/library')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set up views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
const indexRouter = require('./routes/index');
const bookRouter = require('./routes/books');
const authorRouter = require('./routes/authors');

app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/authors', authorRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;