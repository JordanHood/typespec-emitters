import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['test/fixtures/**', '**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'dist/**',
        'test/**',
        'examples/**',
        '**/*.test.ts',
        '**/*.config.ts',
        'src/testing/**',
      ],
    },
    testTimeout: 30000,
  },
});
