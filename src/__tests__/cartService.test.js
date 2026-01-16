/**
 * Cart Service Tests
 * Unit tests for cart operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import cartService from '../../services/cartService';

describe('Cart Service', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    image: 'test.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValueOnce(null);
  });

  describe('getCart', () => {
    it('should return empty array when cart is empty', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await cartService.getCart();

      expect(result).toEqual([]);
    });

    it('should return cart items when cart exists', async () => {
      const mockCart = [
        { ...mockProduct, quantity: 1 },
      ];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockCart));

      const result = await cartService.getCart();

      expect(result).toEqual(mockCart);
    });

    it('should handle errors gracefully', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await cartService.getCart();

      expect(result).toEqual([]);
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      AsyncStorage.setItem.mockResolvedValueOnce(null);

      const result = await cartService.addToCart(mockProduct, 1);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: mockProduct.id,
        name: mockProduct.name,
        quantity: 1,
      });
    });

    it('should increase quantity if item already in cart', async () => {
      const existingCart = [{ ...mockProduct, quantity: 1 }];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingCart));
      AsyncStorage.setItem.mockResolvedValueOnce(null);

      const result = await cartService.addToCart(mockProduct, 2);

      expect(result[0].quantity).toBe(3);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const existingCart = [{ ...mockProduct, quantity: 1 }];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingCart));
      AsyncStorage.setItem.mockResolvedValueOnce(null);

      const result = await cartService.removeFromCart(mockProduct.id);

      expect(result).toHaveLength(0);
    });
  });

  describe('getCartTotal', () => {
    it('should calculate cart total correctly', async () => {
      const existingCart = [
        { ...mockProduct, quantity: 2, price: 30 },
        { id: '2', name: 'Product 2', quantity: 1, price: 20 },
      ];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingCart));

      const result = await cartService.getCartTotal();

      expect(result).toBe(80); // (30 * 2) + (20 * 1)
    });

    it('should return 0 when cart is empty', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await cartService.getCartTotal();

      expect(result).toBe(0);
    });
  });

  describe('getCartCount', () => {
    it('should return total quantity in cart', async () => {
      const existingCart = [
        { ...mockProduct, quantity: 2 },
        { id: '2', name: 'Product 2', quantity: 3 },
      ];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingCart));

      const result = await cartService.getCartCount();

      expect(result).toBe(5);
    });
  });

  describe('clearCart', () => {
    it('should clear the cart', async () => {
      AsyncStorage.removeItem.mockResolvedValueOnce(null);

      const result = await cartService.clearCart();

      expect(result).toEqual([]);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('sisters_promise_cart');
    });
  });
});
