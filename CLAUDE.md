# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sisters Promise Mobile is a React Native e-commerce application for iOS and Android. Built with React Native 0.83.1, React 19.2.0, and TypeScript 5.8.3.

## Common Commands

```bash
# Development
npm start                 # Start Metro bundler
npm run ios              # Build and run on iOS simulator
npm run android          # Build and run on Android emulator

# Testing
npm test                 # Run all tests (Jest)
npm test -- --watch      # Run tests in watch mode
npm test -- path/to/test # Run a single test file

# Code Quality
npm run lint             # Run ESLint
```

## Architecture

### State Management
- **Context API** with custom hooks (`AuthContext`, `CartContext`)
- `AuthContext` manages JWT authentication, user data, and auto-login from AsyncStorage
- `CartContext` manages shopping cart state backed by AsyncStorage

### Navigation Structure
```
RootNavigator (conditional auth check)
├── AuthNavigator (logged out)
│   ├── LoginScreen
│   └── RegisterScreen
└── AppNavigator (logged in)
    └── Bottom Tabs
        ├── Shop Tab → HomeScreen → ProductDetailScreen
        ├── Cart Tab → CartScreen → CheckoutScreen
        └── Profile Tab → ProfileScreen, PrivacyPolicyScreen
```

### Services Pattern
All API interactions go through `/src/services/`:
- `api.js` - Axios instance with request interceptor (adds Bearer token) and response interceptor (handles 401, network errors)
- `authService.js` - Login, register, logout, token management
- `productService.js` - Product CRUD and search
- `cartService.js` - Cart operations (AsyncStorage-backed)
- `analyticsService.js` - GA4 tracking (GDPR/CCPA compliant, no PII)

### Key Directories
- `/src/screens/` - Screen components
- `/src/navigation/` - React Navigation setup
- `/src/context/` - Context providers (Auth, Cart)
- `/src/services/` - API and business logic
- `/src/components/` - Reusable UI components
- `/src/theme/` - Design system (colors, typography, spacing)
- `/src/utils/` - Utilities (logger)
- `/src/__tests__/` - Jest tests

## Code Conventions

### Naming
- Components/Screens: PascalCase (`HomeScreen`, `ProductCard`)
- Services: camelCase with "Service" suffix (`authService`)
- Context: PascalCase with "Context" suffix (`AuthContext`)

### Style
- Single quotes, trailing commas
- Functional components with hooks
- `StyleSheet.create()` for React Native styles
- Async/await for promises
- Use `logger.log/error/warn/info` instead of console (auto-disabled in production)

## Environment Variables

Copy `.env.example` to `.env`. Required variables:
- `API_BASE_URL` - Backend API endpoint
- `GA_MEASUREMENT_ID` - Google Analytics 4 ID
- `ENV` - development or production

## Testing

Jest with React Native preset. Tests located in `/src/__tests__/`. Coverage threshold is 30%.

Run a specific test:
```bash
npm test -- src/__tests__/cartService.test.js
```
