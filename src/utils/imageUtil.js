/**
 * Image Utility - Safe image URI handling
 * Sanitizes and validates image URLs to prevent "unsanitized script URL string" warnings
 */

import logger from './logger';

/**
 * Safely encode image URI to prevent React Native security warnings
 * Handles Etsy URLs and other external image sources
 */
export const encodeImageUri = (uri) => {
  if (!uri || typeof uri !== 'string' || uri.trim() === '') {
    return null;
  }

  try {
    // Trim whitespace
    const trimmedUri = uri.trim();
    
    // Check if it's a valid URL format (starts with http/https)
    if (!trimmedUri.startsWith('http://') && !trimmedUri.startsWith('https://')) {
      logger.warn('[ImageUtil] Invalid image protocol (not http/https):', trimmedUri.substring(0, 50));
      return null;
    }

    // Try to parse to validate URL structure
    try {
      new URL(trimmedUri);
    } catch (urlError) {
      logger.warn('[ImageUtil] Invalid URL format:', trimmedUri.substring(0, 50), urlError.message);
      return null;
    }

    // Return the full URI as-is (React Native handles URL encoding internally)
    // The warning about "unsanitized script URL string" is from special characters in query params
    // This is safe for image URIs from trusted sources like Etsy
    return trimmedUri;
  } catch (error) {
    logger.warn('[ImageUtil] Unexpected error encoding URI:', error.message);
    return null;
  }
};

/**
 * Get safe image source object for React Native Image component
 * Returns null if URI is invalid to gracefully handle missing/bad images
 */
export const getSafeImageSource = (imageUri) => {
  if (!imageUri) {
    return null;
  }

  const safeUri = encodeImageUri(imageUri);
  
  if (!safeUri) {
    // Log the invalid URI for debugging but don't crash
    logger.log('[ImageUtil] Skipping invalid image URI');
    return null;
  }

  return { uri: safeUri };
};

/**
 * Extract best image URL from product object
 * Handles multiple formats:
 * - Single image field
 * - imageUrl field
 * - images array with url/thumbnailUrl
 * - Legacy formats
 */
export const getProductImageUrl = (product) => {
  if (!product) return null;

  // Priority 1: images array with full URL
  if (Array.isArray(product.images) && product.images.length > 0) {
    const primaryImage = product.images.find((img) => img && img.isPrimary) || product.images[0];
    if (primaryImage) {
      const imageUrl = primaryImage.url || primaryImage.thumbnailUrl || primaryImage.imageUrl;
      if (imageUrl) return imageUrl;
    }
  }

  // Priority 2: Direct image field (legacy/Etsy format)
  if (product.image && typeof product.image === 'string') {
    return product.image;
  }

  // Priority 3: imageUrl field
  if (product.imageUrl && typeof product.imageUrl === 'string') {
    return product.imageUrl;
  }

  // Priority 4: images array with thumbnailUrl only
  if (Array.isArray(product.images) && product.images.length > 0) {
    if (product.images[0] && product.images[0].thumbnailUrl) {
      return product.images[0].thumbnailUrl;
    }
  }

  return null;
};

export default {
  encodeImageUri,
  getSafeImageSource,
  getProductImageUrl,
};
