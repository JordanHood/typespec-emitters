import { createTypeSpecLibrary, JSONSchemaType } from '@typespec/compiler';

export interface EmitterOptions {
  /**
   * Schema validation library to use.
   * Currently only "zod" is supported.
   * @default "zod"
   */
  schemaType?: 'zod' | 'typebox';
}

const EmitterOptionsSchema: JSONSchemaType<EmitterOptions> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    schemaType: {
      type: 'string',
      enum: ['zod', 'typebox'],
      nullable: true,
      default: 'zod',
    },
  },
  required: [],
};

export const $lib = createTypeSpecLibrary({
  name: '@typespec-dev/emitter-fastify',
  diagnostics: {
    'http-emit-disabled': {
      severity: 'error',
      messages: {
        default: 'Cannot emit Fastify server due to errors in HTTP service definition.',
      },
    },
    'no-services-in-program': {
      severity: 'error',
      messages: {
        default: 'No services found in the program. Use @service decorator to define a service.',
      },
    },
  },
  emitter: {
    options: EmitterOptionsSchema,
  },
});

export const { reportDiagnostic, createDiagnostic } = $lib;
