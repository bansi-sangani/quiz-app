/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['reflect-metadata'], // Load reflect-metadata before running tests
  transform: {
    '^.+\\.ts$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
  moduleFileExtensions: ['ts', 'js'], // Recognize both TypeScript and JavaScript files
  testMatch: ['**/*.test.ts'], // Match test files ending with .test.ts
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map @/ to src/ for cleaner imports
  },
  verbose: true, // Show detailed test results
};