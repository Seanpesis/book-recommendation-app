const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');

router.post('/add', async (req, res) => {
  const { token, bookId } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.wishlist.push(bookId);
    await user.save();
    res.status(200).json({ message: 'Book added to wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book to wishlist' });
  }
});

module.exports = router;
