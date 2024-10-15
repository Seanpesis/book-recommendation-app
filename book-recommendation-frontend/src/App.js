import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [genres, setGenres] = useState([
    'Fantasy', 
    'Science Fiction', 
    'Mystery', 
    'Romance', 
    'Thriller', 
    'Horror', 
    'Biography', 
    'History', 
    'Poetry'
  ]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [books, setBooks] = useState([]);

  // פונקציית חיפוש ספרים
  const handleSearch = () => {
    if (selectedGenre) {
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:${selectedGenre}&maxResults=40&key=AIzaSyAwCjY5irRkJ9oTUZOJDTlOIhQoC8LZ0Oo`)
        .then(response => {
          setBooks(response.data.items || []);
        })
        .catch(error => {
          console.error('Error fetching books', error);
        });
    }
  };

  // פונקציה לעדכון לייקים בשרת
  const handleLike = (googleBookId) => {
    axios.post(`/books/like/${googleBookId}`)
      .then(response => {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === googleBookId
              ? { ...book, likes: response.data.likes } // עדכון כמות הלייקים מהשרת
              : book
          )
        );
      })
      .catch(error => {
        console.error('Error liking the book', error);
      });
  };

  // פונקציה לעדכון דיסלייקים בשרת
  const handleDislike = (googleBookId) => {
    axios.post(`/books/dislike/${googleBookId}`)
      .then(response => {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === googleBookId
              ? { ...book, dislikes: response.data.dislikes } // עדכון כמות הדיסלייקים מהשרת
              : book
          )
        );
      })
      .catch(error => {
        console.error('Error disliking the book', error);
      });
  };

  return (
    <div className="App">
      <header>
        <h1>Book Search by Genre</h1>
      </header>

      <div className="search-container">
        <select onChange={(e) => setSelectedGenre(e.target.value)} value={selectedGenre}>
          <option value="">Choose a Genre</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <button onClick={handleSearch}>Search Books</button>
      </div>

      <div className="books-container">
        {books.length > 0 && <h2>Books in {selectedGenre}</h2>}
        <ul className="book-list">
          {books.map(book => (
            <li key={book.id} className="book-item">
              <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
              <div className="book-details">
                <h3>{book.volumeInfo.title}</h3>
                <p>By {book.volumeInfo.authors?.join(', ')}</p>
                <p>{book.volumeInfo.description}</p>
                <div className="like-dislike-container">
                  <button onClick={() => handleLike(book.id)}>Like</button>
                  <span>{book.likes || 0} Likes</span>
                  <button onClick={() => handleDislike(book.id)}>Dislike</button>
                  <span>{book.dislikes || 0} Dislikes</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
