const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // טוען את משתני הסביבה מהקובץ .env

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // מאפשר שליחת בקשות JSON

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://seanpesis:Sp080301@book-recommendation.lnb0n.mongodb.net/book-recommendation?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// מודל לספרים (Books)
const bookSchema = new mongoose.Schema({
  googleBookId: { type: String, required: true, unique: true },
  title: { type: String },
  author: { type: String },
  description: { type: String },
  image: { type: String },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

const Book = mongoose.model('Book', bookSchema);

// Route to update likes
app.post('/books/like/:googleBookId', async (req, res) => {
  try {
    const { googleBookId } = req.params;
    const book = await Book.findOneAndUpdate(
      { googleBookId },
      { $inc: { likes: 1 } }, // העלאה של 1 ללייקים
      { new: true, upsert: true }
    );
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like the book' });
  }
});

// Route to update dislikes
app.post('/books/dislike/:googleBookId', async (req, res) => {
  try {
    const { googleBookId } = req.params;
    const book = await Book.findOneAndUpdate(
      { googleBookId },
      { $inc: { dislikes: 1 } }, // העלאה של 1 לדיסלייקים
      { new: true, upsert: true }
    );
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to dislike the book' });
  }
});

// הפעלת השרת
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
