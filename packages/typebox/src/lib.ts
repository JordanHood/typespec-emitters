import { createTypeSpecLibrary } from '@typespec/compiler';

export const $lib = createTypeSpecLibrary({
  name: '@typespec-dev/emitter-typebox',
  diagnostics: {
    'unhandled-type': {
      severity: 'warning',
      messages: {
        default: 'TypeBox emitter encountered an unhandled type kind and emitted Type.Any()',
      },
    },
    'unhandled-intrinsic': {
      severity: 'warning',
      messages: {
        default: 'TypeBox emitter encountered an unknown intrinsic name and emitted Type.Any()',
      },
    },
    'unsupported-bytes-scalar': {
      severity: 'warning',
      messages: {
        default: 'TypeBox emitter does not support bytes scalars; emitting Type.Any()',
      },
    },
    'unrecognized-scalar': {
      severity: 'warning',
      messages: {
        default: 'TypeBox emitter encountered an unrecognized scalar and emitted Type.Any()',
      },
    },
  },
});

export const { reportDiagnostic, createDiagnostic } = $lib;
