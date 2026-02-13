# Testing Guide - Sister's Promise Mobile

This guide explains how to run tests, write new tests, and maintain test coverage.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with coverage report
```bash
npm test -- --coverage
```

### Run specific test file
```bash
npm test -- cartService.test.js
```

### Update snapshots (if using snapshot testing)
```bash
npm test -- --updateSnapshot
```

---

## Test Structure

```
src/
├── __tests__/
│   ├── setup.js                 # Global test setup & mocks
│   ├── api.test.js              # API service tests
│   ├── cartService.test.js      # Cart service tests
│   └── utils.test.js            # Utility function tests
├── services/
│   └── cartService.js
├── context/
│   └── CartContext.js
└── screens/
    └── LoginScreen.js
```

---

## Writing Tests

### 1. Test a Service Function

```javascript
import cartService from '../../services/cartService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('cartService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add item to cart', async () => {
    const mockProduct = { id: '1', name: 'Test', price: 10 };
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    
    const result = await cartService.addToCart(mockProduct);
    
    expect(result).toHaveLength(1);
  });
});
```

### 2. Test a Component

```javascript
import React from 'react';
import renderer from 'react-test-renderer';
import LoginScreen from '../../screens/LoginScreen';

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<LoginScreen navigation={{}} />)
      .toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('shows error on invalid email', () => {
    // Test component behavior
  });
});
```

### 3. Test a Utility Function

```javascript
describe('Validation Utils', () => {
  it('should validate email format', () => {
    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

---

## Common Test Patterns

### Mocking AsyncStorage

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

// In tests:
AsyncStorage.getItem.mockResolvedValueOnce('stored-value');
```

### Mocking Network Calls

```javascript
import api from '../../services/api';

jest.mock('../../services/api');

// In tests:
api.get.mockResolvedValueOnce({ data: { success: true } });
api.post.mockRejectedValueOnce({ response: { status: 500 } });
```

### Testing Async Operations

```javascript
it('should handle async operations', async () => {
  const promise = new Promise(resolve => {
    setTimeout(() => resolve('done'), 100);
  });

  await expect(promise).resolves.toBe('done');
});
```

### Testing Error Handling

```javascript
it('should handle errors', async () => {
  const failingFunction = () => {
    throw new Error('Something went wrong');
  };

  expect(failingFunction).toThrow('Something went wrong');
});
```

---

## Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Statements | 70% | 40% |
| Branches | 70% | 40% |
| Functions | 70% | 40% |
| Lines | 70% | 40% |

To improve coverage, focus on:
1. Service layer tests (API, cart, auth)
2. Error handling paths
3. Edge cases (empty arrays, null values)
4. Component interactions

---

## Debugging Tests

### Print debug info
```javascript
it('should do something', () => {
  console.log('Debug:', myVariable);
  expect(true).toBe(true);
});
```

### Run single test
```bash
npm test -- --testNamePattern="should add item to cart"
```

### Stop on first failure
```bash
npm test -- --bail
```

### Verbose output
```bash
npm test -- --verbose
```

---

## Pre-commit Testing

Add this to `.git/hooks/pre-commit` to run tests before committing:

```bash
#!/bin/bash
npm test -- --bail --coverage
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

---

## Next Steps

1. **Add more service tests** - CartService, analyticsService, authService
2. **Add component tests** - LoginScreen, CartScreen, CheckoutScreen
3. **Add integration tests** - Full user flows (login → add to cart → checkout)
4. **Add E2E tests** - Use Detox or Appium for full app testing
5. **Set up CI/CD testing** - Run tests in GitHub Actions on every push

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://jestjs.io/docs/tutorial-react-native)

---

**Last Updated:** January 16, 2026
