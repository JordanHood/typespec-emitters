import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/versioning/typeChangedFrom/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { TypeChangedFrom } from '../generated/versioning/typeChangedFrom/operations/typechangedfrom.js';
import type { TestModel } from '../generated/versioning/typeChangedFrom/models/typechangedfrom.js';

describe('Versioning.TypeChangedFrom', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const typechangedfromOps: TypeChangedFrom = {
      test: async function (body: TestModel, options) {
        expect(body).toEqual({ prop: 'foo', changedProp: 'bar' });
        expect(options.param).toBe('baz');
        return {
          statusCode: 200,
          body: { prop: 'foo', changedProp: 'bar' },
        };
      },
    };

    const operations = {
      typechangedfrom: typechangedfromOps,
    };

    const app = fastify({ logger: false });
    await app.register(async function (instance) {
      await registerRoutes(instance, operations);
    }, { prefix: '/versioning/type-changed-from/api-version:v2' });

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('versioning/typeChangedFrom', baseUrl);
    expect(status).toBe('pass');
  });
});
