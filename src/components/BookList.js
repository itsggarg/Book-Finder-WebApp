import React, { useMemo } from 'react';
import BookItem from './BookItem';

function BookList({ books }) {
  const styles = useMemo(() => ({
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '1.5rem',
      padding: '1rem'
    },
    emptyState: {
      textAlign: 'center',
      padding: '2rem',
      color: '#6B7280',
      fontSize: '1.125rem'
    }
  }), []); // Empty dependency array since styles don't depend on props

  // Early return for empty state
  if (!Array.isArray(books) || books.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>Please enter a search term to find books.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {books.map((book) => (
          <BookItem 
            key={book.key || book.id} // Fallback to book.id if key is not available
            book={book} 
          />
        ))}
      </div>
    </div>
  );
}

export default BookList;