const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.post('/like/:googleBookId', async (req, res) => {
  try {
    const { googleBookId } = req.params;
    const book = await Book.findOneAndUpdate(
      { googleBookId },
      { $inc: { likes: 1 } }, 
      { new: true, upsert: true } 
    );
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like the book' });
  }
});

router.post('/dislike/:googleBookId', async (req, res) => {
  try {
    const { googleBookId } = req.params;
    const book = await Book.findOneAndUpdate(
      { googleBookId },
      { $inc: { dislikes: 1 } }, 
      { new: true, upsert: true }
    );
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to dislike the book' });
  }
});

module.exports = router;
