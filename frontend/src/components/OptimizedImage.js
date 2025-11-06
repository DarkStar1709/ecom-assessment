import React, { useState } from 'react';

/**
 * Optimized image component with lazy loading, error handling, and loading states
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alternative text
 * @param {string} props.className - CSS classes
 * @param {string} props.fallbackSrc - Fallback image URL
 * @param {boolean} props.lazy - Enable lazy loading (default: true)
 * @param {Function} props.onLoad - Callback when image loads
 * @param {Function} props.onError - Callback when image fails to load
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  fallbackSrc = 'https://via.placeholder.com/200x150?text=No+Image',
  lazy = true,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = (e) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    setCurrentSrc(fallbackSrc);
    if (onError) onError(e);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
          Image not available
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;