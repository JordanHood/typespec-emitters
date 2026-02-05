import { createPackage } from '@alloy-js/typescript';

/**
 * External package descriptor for Fastify.
 * This allows Alloy's automatic import system to generate imports from 'fastify'
 * when these symbols are referenced.
 */
export const fastifyLib = createPackage({
  name: 'fastify',
  version: '^5.0.0',
  descriptor: {
    '.': {
      default: 'Fastify',
      named: [
        'fastify',
        'FastifyInstance',
        'FastifyRequest',
        'FastifyReply',
        'FastifyPluginAsync',
        'FastifyPluginOptions',
        'FastifyServerOptions',
        'RouteHandlerMethod',
        'RouteOptions',
      ],
    },
  },
});
