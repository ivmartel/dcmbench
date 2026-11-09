import {defineConfig} from 'vitest/config';

// Vitest configuration file, see link for more information
// https://vitest.dev/config/
export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    testTimeout: 5000,
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text-summary'],
      thresholds: {
        statements: 20,
        branches: 0,
        functions: 20,
        lines: 20
      }
    }
  }
});
