import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

function BookItem({ book }) {
  const { title, author_name, first_publish_year, cover_i, key } = book;
  const [imageError, setImageError] = useState(false);

  const styles = useMemo(() => ({
    link: {
      textDecoration: 'none',
      color: 'inherit',
      display: 'block',
      height: '100%'
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      height: '100%',
      ':hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }
    },
    imageContainer: {
      position: 'relative',
      paddingTop: '150%',
      backgroundColor: '#F3F4F6'
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
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
      backgroundColor: '#F3F4F6',
      padding: '1rem',
      textAlign: 'center'
    },
    fallbackIcon: {
      color: '#9CA3AF',
      marginBottom: '0.5rem'
    },
    fallbackText: {
      color: '#6B7280',
      fontSize: '0.875rem',
      maxWidth: '80%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    content: {
      padding: '1rem',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontSize: '1.125rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    author: {
      fontSize: '0.875rem',
      color: '#4B5563',
      marginBottom: '0.25rem'
    },
    publishYear: {
      fontSize: '0.875rem',
      color: '#6B7280',
      marginTop: 'auto'
    }
  }), []); 

  const coverUrl = useMemo(() => 
    cover_i
      ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
      : null,
    [cover_i]
  );

  const workId = useMemo(() => 
    key.split('/').pop(),
    [key]
  );

  const authorText = useMemo(() => {
    if (!author_name?.length) return null;
    return author_name.slice(0, 2).join(', ') + (author_name.length > 2 ? ' et al.' : '');
  }, [author_name]);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link to={`/book/${workId}`} style={styles.link}>
      <div style={styles.card}>
        <div style={styles.imageContainer}>
          {coverUrl && !imageError ? (
            <img
              src={coverUrl}
              alt={`Cover of ${title}`}
              style={styles.image}
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div style={styles.fallbackContainer}>
              <BookOpen size={48} style={styles.fallbackIcon} />
              <div style={styles.fallbackText}>{title}</div>
            </div>
          )}
        </div>
        <div style={styles.content}>
          <h2 style={styles.title}>{title}</h2>
          {authorText && (
            <p style={styles.author}>
              By {authorText}
            </p>
          )}
          {first_publish_year && (
            <p style={styles.publishYear}>
              Published: {first_publish_year}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default BookItem;