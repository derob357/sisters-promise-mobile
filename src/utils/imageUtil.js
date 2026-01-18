/**
 * Image Utility - Safe image URI handling
 * Sanitizes and validates image URLs to prevent "unsanitized script URL string" warnings
 */

/**
 * Safely encode image URI to prevent React Native security warnings
 * Handles Etsy URLs and other external image sources
 */
export const encodeImageUri = (uri) => {
  if (!uri || typeof uri !== 'string') {
    return null;
  }

  try {
    // Parse the URL to validate it
    const url = new URL(uri);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      console.warn('Invalid image protocol:', url.protocol);
      return null;
    }

    // Return the full URI as-is (React Native handles URL encoding internally)
    // The warning about "unsanitized script URL string" is from special characters in query params
    // This is safe for image URIs from trusted sources like Etsy
    return uri;
  } catch (error) {
    console.warn('Invalid image URI:', uri, error.message);
    return null;
  }
};

/**
 * Get safe image source object for React Native Image component
 */
export const getSafeImageSource = (imageUri) => {
  const safeUri = encodeImageUri(imageUri);
  
  if (!safeUri) {
    // Return placeholder if URI is invalid
    return null;
  }

  return { uri: safeUri };
};

/**
 * Extract best image URL from product object
 * Handles both single imageUrl and images array formats
 */
export const getProductImageUrl = (product) => {
  if (!product) return null;

  // Try primary image from images array first
  if (Array.isArray(product.images) && product.images.length > 0) {
    const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
    return primaryImage.url || primaryImage.thumbnailUrl;
  }

  // Fall back to imageUrl field
  return product.imageUrl || null;
};

export default {
  encodeImageUri,
  getSafeImageSource,
  getProductImageUrl,
};
