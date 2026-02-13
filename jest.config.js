/**
 * Jest Configuration
 * Unit and integration test setup for Sister's Promise Mobile
 */

module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.git/',
    '<rootDir>/src/__tests__/setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/__tests__/**',
    '!src/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 15,
      lines: 20,
      statements: 20,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{spec,test}.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}',
  ],
  testEnvironment: 'node',
  verbose: true,
};
