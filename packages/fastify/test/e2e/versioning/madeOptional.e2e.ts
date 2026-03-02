import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/versioning/madeOptional/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { MadeOptional } from '../generated/versioning/madeOptional/operations/madeoptional.js';
import type { TestModel } from '../generated/versioning/madeOptional/models/madeoptional.js';

describe('Versioning.MadeOptional', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const madeoptionalOps: MadeOptional = {
      test: async function (body: TestModel) {
        expect(body.prop).toBe('foo');
        return {
          statusCode: 200,
          body: { prop: 'foo' },
        };
      },
    };

    const operations = {
      madeoptional: madeoptionalOps,
    };

    const app = fastify({ logger: false });
    await app.register(async function (instance) {
      await registerRoutes(instance, operations);
    }, { prefix: '/versioning/made-optional/api-version:v2' });

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('versioning/madeOptional', baseUrl);
    expect(status).toBe('pass');
  });
});
