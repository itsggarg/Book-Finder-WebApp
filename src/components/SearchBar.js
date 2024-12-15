import React, { useState, useMemo, useCallback } from 'react';

function SearchBar({ onSearch }) {
  const [title, setTitle] = useState('');

  const styles = useMemo(() => ({
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '1.5rem',
      backgroundColor: '#FFFFFF',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    form: {
      display: 'flex',
      gap: '0.5rem'
    },
    input: {
      flex: 1,
      padding: '0.75rem 1rem',
      border: '1px solid #E5E7EB',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      ':focus': {
        borderColor: '#2563EB',
        boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.2)'
      }
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#2563EB',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '0.5rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: '#1D4ED8'
      },
      ':active': {
        backgroundColor: '#1E40AF'
      }
    }
  }), []); // Empty dependency array since styles don't depend on props

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      onSearch(trimmedTitle);
    }
  }, [title, onSearch]);

  const handleInputChange = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={title}
          onChange={handleInputChange}
          placeholder="Search for books by title..."
          style={styles.input}
          aria-label="Search books"
        />
        <button 
          type="submit" 
          style={styles.button}
          disabled={!title.trim()}
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;