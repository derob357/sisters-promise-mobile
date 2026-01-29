/**
 * Product Service
 * Manages product fetching and category operations
 */

import api from './api';
import logger from '../utils/logger';

const productService = {
  /**
   * Get all products with optional filtering
   * Returns: Array of products (empty array if no products or error)
   */
  getProducts: async (filters = {}) => {
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.active !== undefined) params.active = filters.active;
      
      const response = await api.get('/api/products', { params });
      
      // Handle multiple response formats with proper validation
      let products = [];
      
      // Format 1: { data: { products: [...] } }
      if (response.data?.data?.products && Array.isArray(response.data.data.products)) {
        products = response.data.data.products;
      }
      // Format 2: { products: [...] }
      else if (response.data?.products && Array.isArray(response.data.products)) {
        products = response.data.products;
      }
      // Format 3: Array directly
      else if (Array.isArray(response.data)) {
        products = response.data;
      }
      // Format 4: { data: [...] }
      else if (response.data?.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      }
      
      // Ensure we always return an array
      return Array.isArray(products) ? products : [];
    } catch (error) {
      logger.error('Error fetching products:', error);
      // Return empty array on error to prevent .map() crashes
      return [];
    }
  },

  /**
   * Get single product
   */
  getProduct: async (productId) => {
    try {
      const response = await api.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch product' };
    }
  },

  /**
   * Get products by category
   * Returns: Array of products (empty array if no products or error)
   */
  getByCategory: async (category) => {
    try {
      const response = await api.get('/api/products', { 
        params: { category }
      });
      
      // Handle multiple response formats with proper validation
      let products = [];
      
      if (response.data?.data?.products && Array.isArray(response.data.data.products)) {
        products = response.data.data.products;
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        products = response.data.products;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      }
      
      return Array.isArray(products) ? products : [];
    } catch (error) {
      logger.error('Error fetching category products:', error);
      return [];
    }
  },

  /**
   * Search products
   * Returns: Array of products (empty array if no results or error)
   */
  search: async (query) => {
    try {
      if (!query || !query.trim()) {
        return [];
      }
      
      const response = await api.get('/api/products/search', { 
        params: { q: query }
      });
      
      // Handle multiple response formats with proper validation
      let products = [];
      
      if (response.data?.data?.products && Array.isArray(response.data.data.products)) {
        products = response.data.data.products;
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        products = response.data.products;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      }
      
      return Array.isArray(products) ? products : [];
    } catch (error) {
      logger.error('Error searching products:', error);
      return [];
    }
  },

  /**
   * Get product categories
   */
  getCategories: async () => {
    try {
      const response = await api.get('/api/products/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch categories' };
    }
  },

  /**
   * Get active products only
   * Returns: Array of products (empty array if no products or error)
   */
  getActiveProducts: async () => {
    try {
      const response = await api.get('/api/products', { 
        params: { active: true }
      });
      
      // Handle multiple response formats with proper validation
      let products = [];
      
      if (response.data?.data?.products && Array.isArray(response.data.data.products)) {
        products = response.data.data.products;
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        products = response.data.products;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      }
      
      return Array.isArray(products) ? products : [];
    } catch (error) {
      logger.error('Error fetching active products:', error);
      return [];
    }
  },
};

export default productService;
