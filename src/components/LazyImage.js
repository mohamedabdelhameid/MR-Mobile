import React, { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

const LazyImage = ({ src, alt, style, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
  }, [src]);

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
        style={style}
      />
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666',
          ...style
        }}
      >
        فشل تحميل الصورة
      </Box>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style
      }}
      loading="lazy"
      {...props}
    />
  );
};

export default LazyImage; 