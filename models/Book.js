const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  googleBookId: { type: String, required: true, unique: true },
  title: { type: String },
  author: { type: String },
  description: { type: String },
  image: { type: String },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
