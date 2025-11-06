/**
 * Utility functions for image optimization
 */

/**
 * Generate responsive image URLs for different screen sizes
 * @param {string} baseUrl - Base image URL
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @param {number} quality - Image quality (1-100)
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (baseUrl, width = 200, height = 150, quality = 75) => {
  if (!baseUrl) return '';
  
  // Check if it's an Unsplash URL
  if (baseUrl.includes('unsplash.com')) {
    const url = new URL(baseUrl);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('auto', 'format');
    url.searchParams.set('q', quality.toString());
    return url.toString();
  }
  
  return baseUrl;
};

/**
 * Generate srcSet for responsive images
 * @param {string} baseUrl - Base image URL
 * @param {Array} sizes - Array of {width, height} objects
 * @returns {string} srcSet string
 */
export const generateSrcSet = (baseUrl, sizes = [
  { width: 200, height: 150 },
  { width: 400, height: 300 },
  { width: 600, height: 450 }
]) => {
  if (!baseUrl) return '';
  
  return sizes
    .map(({ width, height }) => {
      const optimizedUrl = getOptimizedImageUrl(baseUrl, width, height);
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
};

/**
 * Get the appropriate image size based on container width
 * @param {number} containerWidth - Container width in pixels
 * @returns {Object} Size object with width and height
 */
export const getImageSizeForContainer = (containerWidth) => {
  if (containerWidth <= 300) {
    return { width: 200, height: 150 };
  } else if (containerWidth <= 600) {
    return { width: 400, height: 300 };
  } else {
    return { width: 600, height: 450 };
  }
};

/**
 * Preload important images
 * @param {Array<string>} imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Check if browser supports WebP format
 * @returns {Promise<boolean>} True if WebP is supported
 */
export const supportsWebP = () => {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};