import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, BookOpen } from 'lucide-react';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);

  const styles = useMemo(() => ({
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: '0.75rem',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    content: {
      display: 'grid',
      gap: '2rem',
      gridTemplateColumns: '1fr',
      '@media (min-width: 768px)': {
        gridTemplateColumns: '300px 1fr'
      }
    },
    imageContainer: {
      width: '100%',
      maxWidth: '300px',
      margin: '0 auto',
      position: 'relative',
      aspectRatio: '2/3',
      backgroundColor: '#F3F4F6',
      borderRadius: '0.5rem',
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    fallbackContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      textAlign: 'center'
    },
    fallbackIcon: {
      color: '#9CA3AF',
      marginBottom: '1rem'
    },
    fallbackText: {
      color: '#6B7280',
      fontSize: '0.875rem',
      maxWidth: '80%'
    },
    details: {
      flex: 1
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#1F2937',
      lineHeight: '1.2'
    },
    section: {
      marginBottom: '1.5rem'
    },
    label: {
      fontWeight: '600',
      color: '#4B5563',
      marginBottom: '0.25rem',
      fontSize: '1.1rem'
    },
    text: {
      color: '#1F2937',
      lineHeight: 1.6,
      fontSize: '1rem'
    },
    description: {
      whiteSpace: 'pre-line',
      color: '#1F2937',
      lineHeight: 1.6,
      fontSize: '1rem'
    },
    subjectTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    tag: {
      backgroundColor: '#F3F4F6',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      color: '#4B5563'
    }
  }), []);

  const formatDescription = (description) => {
    if (!description) return '';
    
    // Remove markdown-style links
    const withoutLinks = description.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // Remove reference-style citations
    const withoutCitations = withoutLinks.replace(/\[Source\]\[\d+\]/g, '');
    
    // Remove remaining square brackets and citations
    const withoutBrackets = withoutCitations.replace(/\[\d+\]/g, '');
    
    // Remove URLs
    const withoutUrls = withoutBrackets.replace(/https?:\/\/[^\s]+/g, '');
    
    // Clean up any double spaces and trim
    return withoutUrls.replace(/\s+/g, ' ').trim();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const fetchBookDetail = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch(`https://openlibrary.org/works/${id}.json`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      const coverUrl = data.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
        : null;

      const description = typeof data.description === 'string'
        ? formatDescription(data.description)
        : formatDescription(data.description?.value || '');

      const authors = data.authors?.length > 0
        ? await Promise.all(
            data.authors.map(async (authorObj) => {
              try {
                const authorResponse = await fetch(`https://openlibrary.org${authorObj.author.key}.json`);
                if (authorResponse.ok) {
                  const authorData = await authorResponse.json();
                  return authorData.name;
                }
              } catch (error) {
                console.error('Error fetching author:', error);
              }
              return 'Unknown Author';
            })
          )
        : [];

      setBook({
        ...data,
        coverUrl,
        authors,
        description
      });
    } catch (error) {
      console.error('Error fetching book details:', error);
      setError(true);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchBookDetail();
  }, [fetchBookDetail]);

  if (loading) {
    return (
      <div style={styles.loading}>
        <Loader2 style={{ width: '2.5rem', height: '2.5rem', color: '#2563EB' }} className="animate-spin" />
        <span>Loading book details...</span>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div style={styles.error}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Error Loading Book
        </h2>
        <p>Failed to load book details. Please try again later.</p>
        <Link to="/" style={{ ...styles.backButton, display: 'inline-block', marginTop: '1rem' }}>
          Return to Search
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.imageContainer}>
          {book.coverUrl && !imageError ? (
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              style={styles.image}
              onError={handleImageError}
            />
          ) : (
            <div style={styles.fallbackContainer}>
              <BookOpen size={64} style={styles.fallbackIcon} />
              <div style={styles.fallbackText}>{book.title}</div>
            </div>
          )}
        </div>
        <div style={styles.details}>
          <h1 style={styles.title}>{book.title}</h1>

          {book.authors?.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.label}>Author{book.authors.length > 1 ? 's' : ''}</h2>
              <p style={styles.text}>{book.authors.join(', ')}</p>
            </div>
          )}

          {book.description && (
            <div style={styles.section}>
              <h2 style={styles.label}>Description</h2>
              <p style={styles.description}>{book.description}</p>
            </div>
          )}

          {book.first_publish_date && (
            <div style={styles.section}>
              <h2 style={styles.label}>First Published</h2>
              <p style={styles.text}>{book.first_publish_date}</p>
            </div>
          )}

          {book.subjects?.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.label}>Subjects</h2>
              <div style={styles.subjectTags}>
                {book.subjects.slice(0, 10).map((subject, index) => (
                  <span key={index} style={styles.tag}>{subject}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;