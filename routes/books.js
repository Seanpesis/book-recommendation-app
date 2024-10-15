const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// עדכון לייקים לספר
router.post('/like/:googleBookId', async (req, res) => {
  try {
    const { googleBookId } = req.params;
    const book = await Book.findOneAndUpdate(
      { googleBookId },
      { $inc: { likes: 1 } }, // העלאת ספירת הלייקים ב-1
      { new: true, upsert: true } // יצירת הספר אם הוא לא קיים
    );
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like the book' });
  }
});

// עדכון דיסלייקים לספר
router.post('/dislike/:googleBookId', async (req, res) => {
  try {
    const { googleBookId } = req.params;
    const book = await Book.findOneAndUpdate(
      { googleBookId },
      { $inc: { dislikes: 1 } }, // העלאת ספירת הדיסלייקים ב-1
      { new: true, upsert: true }
    );
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to dislike the book' });
  }
});

module.exports = router;
