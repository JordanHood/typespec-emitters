import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 10000,
    isolate: false,
    include: [
      'test/e2e/parameters/basic.e2e.ts',
      'test/e2e/parameters/path.e2e.ts',
      'test/e2e/parameters/query.e2e.ts',
      'test/e2e/parameters/body-optionality.e2e.ts',
      'test/e2e/parameters/spread.e2e.ts',
      'test/e2e/type/**/*.e2e.ts',
    ],
    exclude: [
      'test/e2e/type/array.e2e.ts',
      'test/e2e/type/dictionary.e2e.ts',
      'test/e2e/type/union.e2e.ts',
      'test/e2e/type/property/nullable.e2e.ts',
      'test/e2e/type/property/additional-properties.e2e.ts',
      'test/e2e/type/property/value-types.e2e.ts',
      'test/e2e/type/property/optionality.e2e.ts',
    ],
  },
});
