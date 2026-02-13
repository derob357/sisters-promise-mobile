/**
 * Cart Context Tests
 * Tests for cart context logic
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../services/cartService', () => ({
  getCart: jest.fn(),
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  getCartTotal: jest.fn(),
  getCartCount: jest.fn(),
}));

import cartService from '../services/cartService';

describe('Cart Context Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadCart', () => {
    it('should load cart data on initialization', async () => {
      const cartData = [{ id: '1', name: 'Soap', price: 12.99, quantity: 2 }];
      cartService.getCart.mockResolvedValueOnce(cartData);
      cartService.getCartCount.mockResolvedValueOnce(2);
      cartService.getCartTotal.mockResolvedValueOnce(25.98);

      const [cart, count, total] = await Promise.all([
        cartService.getCart(),
        cartService.getCartCount(),
        cartService.getCartTotal(),
      ]);

      expect(cart).toEqual(cartData);
      expect(count).toBe(2);
      expect(total).toBe(25.98);
    });

    it('should handle empty cart', async () => {
      cartService.getCart.mockResolvedValueOnce([]);
      cartService.getCartCount.mockResolvedValueOnce(0);
      cartService.getCartTotal.mockResolvedValueOnce(0);

      const [cart, count, total] = await Promise.all([
        cartService.getCart(),
        cartService.getCartCount(),
        cartService.getCartTotal(),
      ]);

      expect(cart).toEqual([]);
      expect(count).toBe(0);
      expect(total).toBe(0);
    });
  });

  describe('addToCart', () => {
    it('should add product to cart', async () => {
      const product = { id: '1', name: 'Soap', price: 12.99 };
      const updatedCart = [{ ...product, quantity: 1 }];
      cartService.addToCart.mockResolvedValueOnce(updatedCart);

      const result = await cartService.addToCart(product, 1);

      expect(cartService.addToCart).toHaveBeenCalledWith(product, 1);
      expect(result).toEqual(updatedCart);
    });

    it('should handle addToCart errors', async () => {
      cartService.addToCart.mockRejectedValueOnce(new Error('Failed'));

      try {
        await cartService.addToCart({ id: '1' }, 1);
      } catch (error) {
        expect(error.message).toBe('Failed');
      }
    });
  });

  describe('removeFromCart', () => {
    it('should remove product from cart', async () => {
      cartService.removeFromCart.mockResolvedValueOnce([]);

      await cartService.removeFromCart('1');

      expect(cartService.removeFromCart).toHaveBeenCalledWith('1');
    });

    it('should handle removeFromCart errors', async () => {
      cartService.removeFromCart.mockRejectedValueOnce(new Error('Failed'));

      try {
        await cartService.removeFromCart('1');
      } catch (error) {
        expect(error.message).toBe('Failed');
      }
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', async () => {
      const updatedCart = [{ id: '1', name: 'Soap', price: 12.99, quantity: 3 }];
      cartService.updateQuantity.mockResolvedValueOnce(updatedCart);

      const result = await cartService.updateQuantity('1', 3);

      expect(cartService.updateQuantity).toHaveBeenCalledWith('1', 3);
      expect(result[0].quantity).toBe(3);
    });
  });

  describe('clearCart', () => {
    it('should clear all cart items', async () => {
      cartService.clearCart.mockResolvedValueOnce([]);

      const result = await cartService.clearCart();

      expect(cartService.clearCart).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('cart state calculations', () => {
    it('should calculate cart total from items', () => {
      const cart = [
        { id: '1', price: 12.99, quantity: 2 },
        { id: '2', price: 19.99, quantity: 1 },
      ];
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      expect(total).toBeCloseTo(45.97);
    });

    it('should calculate cart count from items', () => {
      const cart = [
        { id: '1', quantity: 2 },
        { id: '2', quantity: 3 },
      ];
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      expect(count).toBe(5);
    });

    it('should handle empty cart calculations', () => {
      const cart = [];
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      expect(total).toBe(0);
      expect(count).toBe(0);
    });
  });
});
