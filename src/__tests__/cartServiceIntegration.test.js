/**
 * Cart Service Integration Tests
 * Tests the actual cartService module with mocked AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import cartService from '../services/cartService';

describe('Cart Service (Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return parsed cart from storage', async () => {
      const cart = [{ id: '1', name: 'Soap', price: 12.99, quantity: 1 }];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(cart));

      const result = await cartService.getCart();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('sisters_promise_cart');
      expect(result).toEqual(cart);
    });

    it('should return empty array when cart is empty', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await cartService.getCart();

      expect(result).toEqual([]);
    });

    it('should return empty array on storage error', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await cartService.getCart();

      expect(result).toEqual([]);
    });
  });

  describe('addToCart', () => {
    it('should add new product to empty cart', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      AsyncStorage.setItem.mockResolvedValueOnce(undefined);

      const product = { id: '1', name: 'Soap', price: 12.99, image: 'soap.jpg' };
      const result = await cartService.addToCart(product);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: '1',
        name: 'Soap',
        price: 12.99,
        image: 'soap.jpg',
        quantity: 1,
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'sisters_promise_cart',
        expect.any(String)
      );
    });

    it('should increase quantity for existing product', async () => {
      const existingCart = [{ id: '1', name: 'Soap', price: 12.99, image: 'soap.jpg', quantity: 1 }];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingCart));
      AsyncStorage.setItem.mockResolvedValueOnce(undefined);

      const product = { id: '1', name: 'Soap', price: 12.99 };
      const result = await cartService.addToCart(product, 2);

      expect(result[0].quantity).toBe(3);
    });

    it('should handle product with _id field', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      AsyncStorage.setItem.mockResolvedValueOnce(undefined);

      const product = { _id: 'mongo-id', name: 'Soap', price: 12.99 };
      const result = await cartService.addToCart(product);

      expect(result[0].id).toBe('mongo-id');
    });

    it('should handle product with images array', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      AsyncStorage.setItem.mockResolvedValueOnce(undefined);

      const product = {
        id: '1',
        name: 'Soap',
        price: 12.99,
        images: [{ url: 'https://example.com/img.jpg' }],
      };
      const result = await cartService.addToCart(product);

      expect(result[0].image).toBe('https://example.com/img.jpg');
    });

    it('should handle product with imageUrl field', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      AsyncStorage.setItem.mockResolvedValueOnce(undefined);

      const product = {
        id: '1',
        name: 'Soap',
        price: 12.99,
        imageUrl: 'https://example.com/img.jpg',
      };
      const result = await cartService.addToCart(product);

      expect(result[0].image).toBe('https://example.com/img.jpg');
    });

    it('should throw error on storage failure', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Write error'));

      const product = { id: '1', name: 'Soap', price: 12.99 };
      await expect(cartService.addToCart(product)).rejects.toThrow('Write error');
    });
  });

  describe('removeFromCart', () => {
    it('should remove product by ID', async () => {
      const cart = [
        { id: '1', name: 'Soap', price: 12.99, quantity: 1 },
        { id: '2', name: 'Lotion', price: 19.99, quantity: 1 },
      ];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(cart));
      AsyncStorage.setItem.mockResolvedValueOnce(undefined);

      const result = await cartService.removeFromCart('1');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should return empty array when removing last item', async () => {
      const cart = [{ id: '1', name: 'Soap', price: 12.99, quantity: 1 }];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(cart));
      AsyncStorage.setItem.mockResolvedValueOnce(undefined);

      const result = await cartService.removeFromCart('1');

      expect(result).toEqual([]);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', async () => {
      const cart = [{ id: '1', name: 'Soap', price: 12.99, quantity: 1 }];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(cart));
      AsyncStorage.setItem.mockResolvedValueOnce(undefined);

      const result = await cartService.updateQuantity('1', 5);

      expect(result[0].quantity).toBe(5);
    });

    it('should remove item when quantity is zero or less', async () => {
      const cart = [{ id: '1', name: 'Soap', price: 12.99, quantity: 1 }];
      // First getItem for updateQuantity, second for removeFromCart
      AsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(cart))
        .mockResolvedValueOnce(JSON.stringify(cart));
      AsyncStorage.setItem.mockResolvedValue(undefined);

      const result = await cartService.updateQuantity('1', 0);

      expect(result).toEqual([]);
    });

    it('should return unchanged cart when item not found', async () => {
      const cart = [{ id: '1', name: 'Soap', price: 12.99, quantity: 1 }];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(cart));

      const result = await cartService.updateQuantity('999', 5);

      expect(result).toEqual(cart);
    });
  });

  describe('clearCart', () => {
    it('should remove cart from storage and return empty array', async () => {
      AsyncStorage.removeItem.mockResolvedValueOnce(undefined);

      const result = await cartService.clearCart();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('sisters_promise_cart');
      expect(result).toEqual([]);
    });

    it('should throw error on storage failure', async () => {
      AsyncStorage.removeItem.mockRejectedValueOnce(new Error('Error'));

      await expect(cartService.clearCart()).rejects.toThrow('Error');
    });
  });

  describe('getCartTotal', () => {
    it('should calculate total correctly', async () => {
      const cart = [
        { id: '1', name: 'Soap', price: 12.99, quantity: 2 },
        { id: '2', name: 'Lotion', price: 19.99, quantity: 1 },
      ];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(cart));

      const total = await cartService.getCartTotal();

      expect(total).toBeCloseTo(45.97);
    });

    it('should return 0 for empty cart', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const total = await cartService.getCartTotal();

      expect(total).toBe(0);
    });

    it('should return 0 on error', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Error'));

      const total = await cartService.getCartTotal();

      expect(total).toBe(0);
    });
  });

  describe('getCartCount', () => {
    it('should count total items', async () => {
      const cart = [
        { id: '1', quantity: 2 },
        { id: '2', quantity: 3 },
      ];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(cart));

      const count = await cartService.getCartCount();

      expect(count).toBe(5);
    });

    it('should return 0 for empty cart', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const count = await cartService.getCartCount();

      expect(count).toBe(0);
    });

    it('should return 0 on error', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Error'));

      const count = await cartService.getCartCount();

      expect(count).toBe(0);
    });
  });
});
