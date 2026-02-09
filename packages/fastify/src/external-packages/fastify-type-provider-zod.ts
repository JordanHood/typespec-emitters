import { createPackage } from '@alloy-js/typescript';

export const fastifyTypeProviderZod = createPackage({
  name: 'fastify-type-provider-zod',
  version: '^4.0.0',
  descriptor: {
    '.': {
      named: ['serializerCompiler', 'validatorCompiler', 'ZodTypeProvider'],
    },
  },
});
