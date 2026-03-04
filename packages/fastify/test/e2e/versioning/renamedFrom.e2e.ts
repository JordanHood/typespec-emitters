import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/versioning/renamedFrom/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { RenamedFrom } from '../generated/versioning/renamedFrom/operations/renamedfrom.js';
import type { NewInterface } from '../generated/versioning/renamedFrom/operations/newinterface.js';

describe('Versioning.RenamedFrom', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const renamedfromOps: RenamedFrom = {
      newOp: async function (body, options) {
        expect(body).toEqual({ newProp: 'foo', enumProp: 'newEnumMember', unionProp: 10 });
        expect(options.newQuery).toBe('bar');
        return {
          statusCode: 200,
          body: { newProp: 'foo', enumProp: 'newEnumMember', unionProp: 10 },
        };
      },
    };

    const newinterfaceOps: NewInterface = {
      newOpInNewInterface: async function (body) {
        expect(body).toEqual({ newProp: 'foo', enumProp: 'newEnumMember', unionProp: 10 });
        return {
          statusCode: 200,
          body: { newProp: 'foo', enumProp: 'newEnumMember', unionProp: 10 },
        };
      },
    };

    const operations = {
      renamedfrom: renamedfromOps,
      newinterface: newinterfaceOps,
    };

    const app = fastify({ logger: false });
    await app.register(
      async function (instance) {
        await registerRoutes(instance, operations);
      },
      { prefix: '/versioning/renamed-from/api-version:v2' }
    );

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('versioning/renamedFrom', baseUrl);
    expect(status).toBe('pass');
  });
});
