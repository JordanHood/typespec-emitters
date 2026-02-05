import { deepStrictEqual } from 'node:assert';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/parameters/basic/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { ExplicitBody } from '../generated/parameters/basic/operations/explicitbody.js';
import type { ImplicitBody } from '../generated/parameters/basic/operations/implicitbody.js';

describe('Parameters.Basic', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const explicitBodyOps: ExplicitBody = {
      simple: async function (body) {
        deepStrictEqual(body, { name: 'foo' });
        return { statusCode: 204 };
      },
    };

    const implicitBodyOps: ImplicitBody = {
      simple: async function (body) {
        deepStrictEqual(body, { name: 'foo' });
        return { statusCode: 204 };
      },
    };

    const operations = {
      explicitbody: explicitBodyOps,
      implicitbody: implicitBodyOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('parameters/basic', baseUrl);
    expect(status).toBe('pass');
  });
});
