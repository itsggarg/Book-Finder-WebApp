import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import SearchBar from './components/SearchBar';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)',
      padding: '2rem'
    },
    maxWidthWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem'
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #2563EB, #60A5FA)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginLeft: '1rem'
    },
    subtitle: {
      color: '#4B5563',
      fontSize: '1.125rem'
    },
    main: {
      marginTop: '2rem'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem'
    },
    loadingText: {
      marginLeft: '0.75rem',
      fontSize: '1.125rem',
      color: '#4B5563'
    },
    footer: {
      marginTop: '4rem',
      textAlign: 'center',
      color: '#6B7280',
      fontSize: '0.875rem'
    }
  };

  const handleSearch = async (title) => {
    setLoading(true);
    setError(null);
    setBooks([]);

    try {
      const encodedTitle = encodeURIComponent(title.trim());
      const response = await fetch(`https://openlibrary.org/search.json?title=${encodedTitle}&limit=20`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      if (data.numFound === 0) {
        setError('No books found matching your search.');
      } else {
        setBooks(data.docs);
      }
    } catch (error) {
      setError('There was a problem fetching the books. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidthWrapper}>
        <header style={styles.header}>
          <div style={styles.titleContainer}>
            <BookOpen style={{ width: '3rem', height: '3rem', color: '#2563EB' }} />
            <h1 style={styles.title}>Book Finder</h1>
          </div>
          <p style={styles.subtitle}>Discover your next favorite book</p>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <main style={styles.main}>
                <SearchBar onSearch={handleSearch} />
                {loading && (
                  <div style={styles.loadingContainer}>
                    <Loader2 style={{ width: '2rem', height: '2rem', color: '#2563EB' }} className="animate-spin" />
                    <span style={styles.loadingText}>Searching for books...</span>
                  </div>
                )}
                {error && (
                  <div style={{
                    maxWidth: '600px',
                    margin: '2rem auto',
                    padding: '1rem',
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    borderRadius: '0.5rem',
                    textAlign: 'center'
                  }}>
                    {error}
                  </div>
                )}
                {!loading && !error && books.length > 0 && <BookList books={books} />}
              </main>
            }
          />
          <Route path="/book/:id" element={<BookDetail />} />
        </Routes>

        <footer style={styles.footer}>
          <p>Powered by Open Library API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;