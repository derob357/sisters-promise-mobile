/**
 * Image Utility Tests
 * Unit tests for image URL handling and validation
 */

import { encodeImageUri, getSafeImageSource, getProductImageUrl } from '../utils/imageUtil';

describe('Image Utility', () => {
  describe('encodeImageUri', () => {
    it('should return valid HTTPS URL as-is', () => {
      const uri = 'https://example.com/image.jpg';
      expect(encodeImageUri(uri)).toBe(uri);
    });

    it('should return valid HTTP URL as-is', () => {
      const uri = 'http://example.com/image.jpg';
      expect(encodeImageUri(uri)).toBe(uri);
    });

    it('should return null for null input', () => {
      expect(encodeImageUri(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(encodeImageUri(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(encodeImageUri('')).toBeNull();
    });

    it('should return null for whitespace-only string', () => {
      expect(encodeImageUri('   ')).toBeNull();
    });

    it('should return null for non-string input', () => {
      expect(encodeImageUri(123)).toBeNull();
    });

    it('should return null for invalid protocol', () => {
      expect(encodeImageUri('ftp://example.com/image.jpg')).toBeNull();
    });

    it('should return null for javascript protocol', () => {
      expect(encodeImageUri('javascript:alert(1)')).toBeNull();
    });

    it('should trim whitespace from URLs', () => {
      const uri = '  https://example.com/image.jpg  ';
      expect(encodeImageUri(uri)).toBe('https://example.com/image.jpg');
    });

    it('should handle URLs with query parameters', () => {
      const uri = 'https://example.com/image.jpg?w=300&h=200';
      expect(encodeImageUri(uri)).toBe(uri);
    });

    it('should handle Etsy image URLs', () => {
      const uri = 'https://i.etsystatic.com/12345/il_300x300.jpg';
      expect(encodeImageUri(uri)).toBe(uri);
    });

    it('should return null for malformed URL', () => {
      expect(encodeImageUri('https://')).toBeNull();
    });
  });

  describe('getSafeImageSource', () => {
    it('should return image source object for valid URI', () => {
      const result = getSafeImageSource('https://example.com/image.jpg');
      expect(result).toEqual({ uri: 'https://example.com/image.jpg' });
    });

    it('should return null for null input', () => {
      expect(getSafeImageSource(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(getSafeImageSource(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(getSafeImageSource('')).toBeNull();
    });

    it('should return null for invalid URI', () => {
      expect(getSafeImageSource('not-a-url')).toBeNull();
    });
  });

  describe('getProductImageUrl', () => {
    it('should return null for null product', () => {
      expect(getProductImageUrl(null)).toBeNull();
    });

    it('should return null for undefined product', () => {
      expect(getProductImageUrl(undefined)).toBeNull();
    });

    it('should return URL from images array with url field', () => {
      const product = {
        images: [{ url: 'https://example.com/img1.jpg' }],
      };
      expect(getProductImageUrl(product)).toBe('https://example.com/img1.jpg');
    });

    it('should prioritize primary image from images array', () => {
      const product = {
        images: [
          { url: 'https://example.com/secondary.jpg' },
          { url: 'https://example.com/primary.jpg', isPrimary: true },
        ],
      };
      expect(getProductImageUrl(product)).toBe('https://example.com/primary.jpg');
    });

    it('should return thumbnailUrl from images array', () => {
      const product = {
        images: [{ thumbnailUrl: 'https://example.com/thumb.jpg' }],
      };
      expect(getProductImageUrl(product)).toBe('https://example.com/thumb.jpg');
    });

    it('should return direct image field', () => {
      const product = { image: 'https://example.com/image.jpg' };
      expect(getProductImageUrl(product)).toBe('https://example.com/image.jpg');
    });

    it('should return imageUrl field', () => {
      const product = { imageUrl: 'https://example.com/image.jpg' };
      expect(getProductImageUrl(product)).toBe('https://example.com/image.jpg');
    });

    it('should return null when product has no image fields', () => {
      const product = { name: 'Soap', price: 12.99 };
      expect(getProductImageUrl(product)).toBeNull();
    });

    it('should return null when images array is empty', () => {
      const product = { images: [] };
      expect(getProductImageUrl(product)).toBeNull();
    });

    it('should prioritize images array over direct image field', () => {
      const product = {
        images: [{ url: 'https://example.com/array.jpg' }],
        image: 'https://example.com/direct.jpg',
      };
      expect(getProductImageUrl(product)).toBe('https://example.com/array.jpg');
    });

    it('should not return non-string image fields', () => {
      const product = { image: 123 };
      expect(getProductImageUrl(product)).toBeNull();
    });
  });
});
