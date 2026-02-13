/**
 * Product Service Tests
 * Unit tests for product fetching and category operations
 */

jest.mock('../services/api', () => ({
  get: jest.fn(),
}));

import api from '../services/api';
import productService from '../services/productService';

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return products from format 1: { data: { products: [...] } }', async () => {
      const products = [{ id: '1', name: 'Soap' }];
      api.get.mockResolvedValueOnce({ data: { data: { products } } });
      const result = await productService.getProducts();
      expect(result).toEqual(products);
    });

    it('should return products from format 2: { products: [...] }', async () => {
      const products = [{ id: '1', name: 'Soap' }];
      api.get.mockResolvedValueOnce({ data: { products } });
      const result = await productService.getProducts();
      expect(result).toEqual(products);
    });

    it('should return products from format 3: array directly', async () => {
      const products = [{ id: '1', name: 'Soap' }];
      api.get.mockResolvedValueOnce({ data: products });
      const result = await productService.getProducts();
      expect(result).toEqual(products);
    });

    it('should return products from format 4: { data: [...] }', async () => {
      const products = [{ id: '1', name: 'Soap' }];
      api.get.mockResolvedValueOnce({ data: { data: products } });
      const result = await productService.getProducts();
      expect(result).toEqual(products);
    });

    it('should return empty array when data is not array-like', async () => {
      api.get.mockResolvedValueOnce({ data: { message: 'No products' } });
      const result = await productService.getProducts();
      expect(result).toEqual([]);
    });

    it('should pass category filter as params', async () => {
      api.get.mockResolvedValueOnce({ data: [] });
      await productService.getProducts({ category: 'soap' });
      expect(api.get).toHaveBeenCalledWith('/api/products', { params: { category: 'soap' } });
    });

    it('should pass active filter as params', async () => {
      api.get.mockResolvedValueOnce({ data: [] });
      await productService.getProducts({ active: true });
      expect(api.get).toHaveBeenCalledWith('/api/products', { params: { active: true } });
    });

    it('should return empty array on error', async () => {
      api.get.mockRejectedValueOnce(new Error('Network error'));
      const result = await productService.getProducts();
      expect(result).toEqual([]);
    });
  });

  describe('getProduct', () => {
    it('should fetch single product by ID', async () => {
      const product = { id: '1', name: 'Test Product', price: 12.99 };
      api.get.mockResolvedValueOnce({ data: product });
      const result = await productService.getProduct('1');
      expect(api.get).toHaveBeenCalledWith('/api/products/1');
      expect(result).toEqual(product);
    });

    it('should throw error on failure', async () => {
      api.get.mockRejectedValueOnce({ response: { data: { error: 'Not found' } } });
      await expect(productService.getProduct('999')).rejects.toEqual({ error: 'Not found' });
    });

    it('should throw generic error when no response data', async () => {
      api.get.mockRejectedValueOnce({ message: 'Error' });
      await expect(productService.getProduct('1')).rejects.toEqual({ error: 'Failed to fetch product' });
    });
  });

  describe('getByCategory', () => {
    it('should fetch products by category', async () => {
      const products = [{ id: '1', name: 'Soap', category: 'Sea Moss' }];
      api.get.mockResolvedValueOnce({ data: { products } });
      const result = await productService.getByCategory('Sea Moss');
      expect(api.get).toHaveBeenCalledWith('/api/products', { params: { category: 'Sea Moss' } });
      expect(result).toEqual(products);
    });

    it('should return empty array on error', async () => {
      api.get.mockRejectedValueOnce(new Error('Error'));
      const result = await productService.getByCategory('Invalid');
      expect(result).toEqual([]);
    });
  });

  describe('search', () => {
    it('should search products by query', async () => {
      const products = [{ id: '1', name: 'Sea Moss Soap' }];
      api.get.mockResolvedValueOnce({ data: products });
      const result = await productService.search('moss');
      expect(api.get).toHaveBeenCalledWith('/api/products/search', { params: { q: 'moss' } });
      expect(result).toEqual(products);
    });

    it('should return empty array for empty query', async () => {
      const result = await productService.search('');
      expect(result).toEqual([]);
      expect(api.get).not.toHaveBeenCalled();
    });

    it('should return empty array for whitespace-only query', async () => {
      const result = await productService.search('   ');
      expect(result).toEqual([]);
      expect(api.get).not.toHaveBeenCalled();
    });

    it('should return empty array for null query', async () => {
      const result = await productService.search(null);
      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      api.get.mockRejectedValueOnce(new Error('Error'));
      const result = await productService.search('test');
      expect(result).toEqual([]);
    });
  });

  describe('getCategories', () => {
    it('should fetch categories', async () => {
      const categories = ['Soap', 'Sea Moss', 'Essential Oils'];
      api.get.mockResolvedValueOnce({ data: categories });
      const result = await productService.getCategories();
      expect(api.get).toHaveBeenCalledWith('/api/products/categories');
      expect(result).toEqual(categories);
    });

    it('should throw error on failure', async () => {
      api.get.mockRejectedValueOnce({ response: { data: { error: 'Server error' } } });
      await expect(productService.getCategories()).rejects.toEqual({ error: 'Server error' });
    });
  });

  describe('getActiveProducts', () => {
    it('should fetch active products', async () => {
      const products = [{ id: '1', name: 'Active Product', active: true }];
      api.get.mockResolvedValueOnce({ data: products });
      const result = await productService.getActiveProducts();
      expect(api.get).toHaveBeenCalledWith('/api/products', { params: { active: true } });
      expect(result).toEqual(products);
    });

    it('should return empty array on error', async () => {
      api.get.mockRejectedValueOnce(new Error('Error'));
      const result = await productService.getActiveProducts();
      expect(result).toEqual([]);
    });
  });
});
