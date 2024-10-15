const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// מסלול להוספת ספר
router.post('/add', async (req, res) => {
  const { title, author, genre } = req.body;
  try {
    const newBook = new Book({ title, author, genre });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// מסלול לקבלת כל הספרים
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

module.exports = router;
