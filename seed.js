// seed.js
const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/library');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Array of authors
const authors = [
  {
    first_name: 'J.K.',
    last_name: 'Rowling',
    date_of_birth: '1965-07-31'
  },
  {
    first_name: 'George R.R.',
    last_name: 'Martin',
    date_of_birth: '1948-09-20'
  },
  {
    first_name: 'Jane',
    last_name: 'Austen',
    date_of_birth: '1775-12-16',
    date_of_death: '1817-07-18'
  }
];

// Array of books (we'll add author IDs after creating authors)
let books = [
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    summary: 'Harry Potter discovers he is a wizard and attends Hogwarts School of Witchcraft and Wizardry.',
    isbn: '9780747532743',
    published_year: 1997
  },
  {
    title: 'A Game of Thrones',
    summary: 'The first book in the A Song of Ice and Fire series.',
    isbn: '9780553103540',
    published_year: 1996
  },
  {
    title: 'Pride and Prejudice',
    summary: 'A romantic novel following the character of Elizabeth Bennet.',
    isbn: '9780141439518',
    published_year: 1813
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Author.deleteMany({});
    await Book.deleteMany({});
    
    console.log('Previous data deleted');
    
    // Create new authors
    const createdAuthors = await Author.insertMany(authors);
    console.log('Authors added');
    
    // Add author references to books
    const authorRowling = createdAuthors.find(a => a.last_name === 'Rowling');
    const authorMartin = createdAuthors.find(a => a.last_name === 'Martin');
    const authorAusten = createdAuthors.find(a => a.last_name === 'Austen');
    
    books[0].author = authorRowling._id;
    books[1].author = authorMartin._id;
    books[2].author = authorAusten._id;
    
    // Create new books
    await Book.insertMany(books);
    console.log('Books added');
    
    console.log('Database seeded successfully!');
    
    // Close the connection
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  }
}

// Run the seed function
seedDatabase();