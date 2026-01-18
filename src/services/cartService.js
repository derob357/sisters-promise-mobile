/**
 * Cart Service
 * Manages shopping cart operations using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';

const CART_KEY = 'sisters_promise_cart';

const cartService = {
  /**
   * Get cart items
   */
  getCart: async () => {
    try {
      const cart = await AsyncStorage.getItem(CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      logger.error('Get cart error:', error);
      return [];
    }
  },

  /**
   * Add item to cart
   */
  addToCart: async (product, quantity = 1) => {
    try {
      // Handle MongoDB _id vs id vs etsyListingId
      const productId = product._id || product.id || product.etsyListingId;

      let cart = await cartService.getCart();
      const existingItem = cart.find((item) => item.id === productId);

      // Handle image - get from images array or legacy imageUrl field
      let imageUrl = product.image;
      if (!imageUrl && Array.isArray(product.images) && product.images.length > 0) {
        imageUrl = product.images[0].url || product.images[0].thumbnailUrl;
      }
      if (!imageUrl) {
        imageUrl = product.imageUrl;
      }

      const cartItem = {
        id: productId,
        name: product.name,
        price: product.price,
        image: imageUrl,
        quantity,
      };

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push(cartItem);
      }

      await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
      return cart;
    } catch (error) {
      logger.error('Add to cart error:', error);
      throw error;
    }
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (productId) => {
    try {
      let cart = await cartService.getCart();
      cart = cart.filter((item) => item.id !== productId);
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
      return cart;
    } catch (error) {
      logger.error('Remove from cart error:', error);
      throw error;
    }
  },

  /**
   * Update item quantity
   */
  updateQuantity: async (productId, quantity) => {
    try {
      let cart = await cartService.getCart();
      const item = cart.find((item) => item.id === productId);

      if (item) {
        if (quantity <= 0) {
          return cartService.removeFromCart(productId);
        }
        item.quantity = quantity;
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
      }

      return cart;
    } catch (error) {
      logger.error('Update quantity error:', error);
      throw error;
    }
  },

  /**
   * Clear cart
   */
  clearCart: async () => {
    try {
      await AsyncStorage.removeItem(CART_KEY);
      return [];
    } catch (error) {
      logger.error('Clear cart error:', error);
      throw error;
    }
  },

  /**
   * Get cart total
   */
  getCartTotal: async () => {
    try {
      const cart = await cartService.getCart();
      return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    } catch (error) {
      logger.error('Get cart total error:', error);
      return 0;
    }
  },

  /**
   * Get cart item count
   */
  getCartCount: async () => {
    try {
      const cart = await cartService.getCart();
      return cart.reduce((count, item) => count + item.quantity, 0);
    } catch (error) {
      logger.error('Get cart count error:', error);
      return 0;
    }
  },
};

export default cartService;
