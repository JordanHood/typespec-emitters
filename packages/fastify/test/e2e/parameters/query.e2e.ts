import { deepStrictEqual } from 'node:assert';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/parameters/query/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { Constant } from '../generated/parameters/query/operations/constant.js';

describe('Parameters.Query', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const constantOps: Constant = {
      post: async function (options) {
        deepStrictEqual(options?.queryParam, 'constantValue');
        return { statusCode: 204 };
      },
    };

    const operations = {
      constant: constantOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('parameters/query', baseUrl);
    expect(status).toBe('pass');
  });
});
