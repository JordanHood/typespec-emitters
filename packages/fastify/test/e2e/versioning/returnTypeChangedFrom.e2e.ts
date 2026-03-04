import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/versioning/returnTypeChangedFrom/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { ReturnTypeChangedFrom } from '../generated/versioning/returnTypeChangedFrom/operations/returntypechangedfrom.js';

describe('Versioning.ReturnTypeChangedFrom', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const returntypechangedfromOps: ReturnTypeChangedFrom = {
      test: async function (body: string) {
        expect(body).toBe('test');
        return {
          statusCode: 200,
          body: 'test',
        };
      },
    };

    const operations = {
      returntypechangedfrom: returntypechangedfromOps,
    };

    const app = fastify({ logger: false });
    await app.register(
      async function (instance) {
        await registerRoutes(instance, operations);
      },
      { prefix: '/versioning/return-type-changed-from/api-version:v2' }
    );

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('versioning/returnTypeChangedFrom', baseUrl);
    expect(status).toBe('pass');
  });
});
