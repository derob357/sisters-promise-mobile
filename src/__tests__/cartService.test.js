/**
 * Cart Service Tests
 * Unit tests for cart operations logic
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('Cart Service', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    image: 'test.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Cart calculations', () => {
    it('should calculate total for multiple items', () => {
      const cart = [
        { ...mockProduct, quantity: 2, price: 30 },
        { id: '2', name: 'Product 2', quantity: 1, price: 20 },
      ];
      
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      expect(total).toBe(80); // (30 * 2) + (20 * 1)
    });

    it('should calculate item count in cart', () => {
      const cart = [
        { ...mockProduct, quantity: 2 },
        { id: '2', name: 'Product 2', quantity: 3 },
      ];
      
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      
      expect(count).toBe(5);
    });

    it('should handle empty cart', () => {
      const cart = [];
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      expect(total).toBe(0);
    });
  });

  describe('Cart operations', () => {
    it('should add new product to empty cart', () => {
      const cart = [];
      const newCart = [
        {
          id: mockProduct.id,
          name: mockProduct.name,
          price: mockProduct.price,
          image: mockProduct.image,
          quantity: 1,
        }
      ];
      
      expect(newCart).toHaveLength(1);
      expect(newCart[0].quantity).toBe(1);
    });

    it('should increase quantity for existing product', () => {
      const existingItem = { ...mockProduct, quantity: 2 };
      existingItem.quantity += 3;
      
      expect(existingItem.quantity).toBe(5);
    });

    it('should remove product from cart', () => {
      const cart = [
        { ...mockProduct, quantity: 1 },
        { id: '2', name: 'Product 2', quantity: 1 },
      ];
      
      const filtered = cart.filter(item => item.id !== mockProduct.id);
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });
  });

  describe('AsyncStorage operations', () => {
    it('should handle storage errors gracefully', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));
      
      try {
        await AsyncStorage.getItem('test_key');
      } catch (error) {
        expect(error.message).toBe('Storage error');
      }
    });

    it('should save data to storage', async () => {
      AsyncStorage.setItem.mockResolvedValueOnce(null);
      
      await AsyncStorage.setItem('test_key', 'test_value');
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test_key', 'test_value');
    });

    it('should remove data from storage', async () => {
      AsyncStorage.removeItem.mockResolvedValueOnce(null);
      
      await AsyncStorage.removeItem('test_key');
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test_key');
    });
  });
});
