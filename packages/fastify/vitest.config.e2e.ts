import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 10000,
    isolate: false,
    include: [
      'test/e2e/**/*.e2e.ts',
    ],
    exclude: [
      // Blocked: Zod does not support recursive/circular model references
      'test/e2e/type/array.e2e.ts',
      'test/e2e/type/dictionary.e2e.ts',
      'test/e2e/type/property/additional-properties.e2e.ts',
      'test/e2e/type/property/value-types.e2e.ts',
      // Blocked: Unresolved Symbol bugs in generated models (z.number() ref missing)
      'test/e2e/versioning/added.e2e.ts',
      'test/e2e/versioning/removed.e2e.ts',
      'test/e2e/versioning/renamedFrom.e2e.ts',
      // Blocked: Unresolved Symbol in generated operations
      'test/e2e/server/**/*.e2e.ts',
      // Blocked: reserved word naming in generated models
      'test/e2e/special-words/**/*.e2e.ts',
      // Blocked: no error response body support in generated routes
      'test/e2e/response/**/*.e2e.ts',
    ],
  },
});
