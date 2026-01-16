/**
 * Cart Context - Global cart state management
 */

import React, { createContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await cartService.getCart();
      const count = await cartService.getCartCount();
      const total = await cartService.getCartTotal();

      setCart(cartData);
      setCartCount(count);
      setCartTotal(total);
    } catch (error) {
      console.log('Load cart error:', error);
    }
  };

  const cartContext = {
    cart,
    cartCount,
    cartTotal,
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
        console.log('Remove from cart error:', error);
      }
    },
    updateQuantity: async (productId, quantity) => {
      try {
        await cartService.updateQuantity(productId, quantity);
        await loadCart();
      } catch (error) {
        console.log('Update quantity error:', error);
      }
    },
    clearCart: async () => {
      try {
        await cartService.clearCart();
        await loadCart();
      } catch (error) {
        console.log('Clear cart error:', error);
      }
    },
  };

  return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>;
};
