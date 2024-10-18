import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import { FaSearch, FaStar, FaMoon, FaSun, FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import Switch from "react-switch";
import ClipLoader from 'react-spinners/ClipLoader';
import './App.css';

function App() {
  const [genres, setGenres] = useState([
    'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller', 'Horror', 
    'Biography', 'History', 'Philosophy', 'Poetry', 'Self-Help', 'Travel'
  ]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [ratings, setRatings] = useState(() => {
    const savedRatings = localStorage.getItem("ratings");
    return savedRatings ? JSON.parse(savedRatings) : {};
  });
  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem("reviews");
    return savedReviews ? JSON.parse(savedReviews) : {};
  });
  const [showReviewPopup, setShowReviewPopup] = useState(null);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("ratings", JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleSearch = () => {
    if (selectedGenre) {
      setLoading(true);
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:${selectedGenre}&maxResults=40&key=AIzaSyAwCjY5irRkJ9oTUZOJDTlOIhQoC8LZ0Oo`)
        .then(response => {
          setBooks(response.data.items || []);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching books', error);
          setLoading(false);
        });
    }
  };

  const handleRating = (bookId, newRating) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [bookId]: newRating,
    }));
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : genres.filter(
      genre => genre.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChange = (event, { newValue }) => {
    setSelectedGenre(newValue);
  };

  const handleMouseEnter = (bookId) => {
    setShowReviewPopup(bookId);
  };

  const handleMouseLeave = () => {
    setShowReviewPopup(null);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header>
        <h1>Book Search by Genre</h1>
        <div className="mode-switch">
          <FaSun />
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            uncheckedIcon={false}
            checkedIcon={false}
          />
          <FaMoon />
        </div>
      </header>

      <div className="search-container">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={(suggestion) => suggestion}
          renderSuggestion={(suggestion) => <div>{suggestion}</div>}
          inputProps={{
            placeholder: 'Search by genre',
            value: selectedGenre,
            onChange: onChange
          }}
        />
        <button onClick={handleSearch} className="search-button">
          <FaSearch /> Search Books
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <ClipLoader color="#1f3c88" />
        </div>
      ) : (
        <InfiniteScroll
          dataLength={books.length}
          next={() => {}}
          hasMore={true}
          loader={<h4>Loading more books...</h4>}
        >
          <div className="books-container">
            {books.length > 0 && <h2>Books in {selectedGenre}</h2>}
            <ul className="book-list">
              {books.map(book => (
                <li key={book.id} className="book-item" onMouseEnter={() => handleMouseEnter(book.id)} onMouseLeave={handleMouseLeave}>
                  <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
                  <div className="book-details">
                    <h3>{book.volumeInfo.title}</h3>
                    <p>By {book.volumeInfo.authors?.join(', ')}</p>
                    <div className="rating">
                      {Array(5).fill(0).map((_, index) => (
                        <FaStar key={index} 
                                color={index < (ratings[book.id] || 0) ? '#ffc107' : '#e4e5e9'}
                                onClick={() => handleRating(book.id, index + 1)} />
                      ))}
                    </div>
                    <div className="share-buttons">
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${book.volumeInfo.infoLink}`} target="_blank" rel="noopener noreferrer" className="social-btn">
                        <FaFacebookF />
                      </a>
                      <a href={`https://twitter.com/intent/tweet?url=${book.volumeInfo.infoLink}`} target="_blank" rel="noopener noreferrer" className="social-btn">
                        <FaTwitter />
                      </a>
                      <a href={`https://api.whatsapp.com/send?text=${book.volumeInfo.infoLink}`} target="_blank" rel="noopener noreferrer" className="social-btn">
                        <FaWhatsapp />
                      </a>
                    </div>
                    {showReviewPopup === book.id && reviews[book.id] && (
                      <div className="review-popup">
                        <h4>Reviews:</h4>
                        {reviews[book.id].map((review, index) => (
                          <p key={index}>{review}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

export default App;
