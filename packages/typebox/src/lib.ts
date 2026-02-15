import { createTypeSpecLibrary } from '@typespec/compiler';

export const $lib = createTypeSpecLibrary({
  name: '@typespec-dev/emitter-typebox',
  diagnostics: {},
});

export const { reportDiagnostic, createDiagnostic } = $lib;
