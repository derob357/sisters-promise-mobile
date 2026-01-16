/**
 * Cart Context - Global cart state management
 */

import React, { createContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import logger from '../utils/logger';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartError, setCartError] = useState(null);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      // Optimize: Use Promise.all for parallel requests instead of sequential
      const [cartData, count, total] = await Promise.all([
        cartService.getCart(),
        cartService.getCartCount(),
        cartService.getCartTotal(),
      ]);

      setCart(cartData);
      setCartCount(count);
      setCartTotal(total);
    } catch (error) {
      logger.error('Load cart error:', error);
      setCartError('Failed to load cart');
    }
  };

  const cartContext = {
    cart,
    cartCount,
    cartTotal,
    cartError,
    clearCartError: () => setCartError(null),
    addToCart: async (product, quantity) => {
      try {
        const updatedCart = await cartService.addToCart(product, quantity);
        await loadCart();
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    removeFromCart: async (productId) => {
      try {
        await cartService.removeFromCart(productId);
        await loadCart();
      } catch (error) {
        logger.error('Remove from cart error:', error);
        setCartError('Failed to remove item');
      }
    },
    updateQuantity: async (productId, quantity) => {
      try {
        await cartService.updateQuantity(productId, quantity);
        await loadCart();
      } catch (error) {
        logger.error('Update quantity error:', error);
        setCartError('Failed to update quantity');
      }
    },
    clearCart: async () => {
      try {
        await cartService.clearCart();
        await loadCart();
      } catch (error) {
        logger.error('Clear cart error:', error);
        setCartError('Failed to clear cart');
      }
    },
  };

  return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>;
};
