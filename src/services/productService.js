/**
 * Product Service
 * Manages product fetching and category operations
 */

import api from './api';

const productService = {
  /**
   * Get all products
   */
  getProducts: async (filters = {}) => {
    try {
      const response = await api.get('/products', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch products' };
    }
  },

  /**
   * Get single product
   */
  getProduct: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch product' };
    }
  },

  /**
   * Get products by category
   */
  getByCategory: async (category) => {
    try {
      const response = await api.get('/products', { params: { category } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch products' };
    }
  },

  /**
   * Search products
   */
  search: async (query) => {
    try {
      const response = await api.get('/products/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Search failed' };
    }
  },

  /**
   * Get product categories
   */
  getCategories: async () => {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch categories' };
    }
  },
};

export default productService;
