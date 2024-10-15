const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// התחברות למסד הנתונים
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// מסלול ברירת מחדל
app.get('/', (req, res) => {
  res.send('Welcome to the Book Recommendation API!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const bookRoutes = require('./routes/books');
app.use('/books', bookRoutes);
