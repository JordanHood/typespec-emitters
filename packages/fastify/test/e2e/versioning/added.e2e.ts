import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/versioning/added/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { Added } from '../generated/versioning/added/operations/added.js';
import type { InterfaceV2 } from '../generated/versioning/added/operations/interfacev2.js';

describe('Versioning.Added', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const addedOps: Added = {
      v1: async function (body, headerV2) {
        expect(body).toEqual({ prop: 'foo', enumProp: 'enumMemberV2', unionProp: 10 });
        expect(headerV2).toBe('bar');
        return {
          statusCode: 200,
          body: { prop: 'foo', enumProp: 'enumMemberV2', unionProp: 10 },
        };
      },
      v2: async function (body) {
        expect(body).toEqual({ prop: 'foo', enumProp: 'enumMember', unionProp: 'bar' });
        return {
          statusCode: 200,
          body: { prop: 'foo', enumProp: 'enumMember', unionProp: 'bar' },
        };
      },
    };

    const interfacev2Ops: InterfaceV2 = {
      v2InInterface: async function (body) {
        expect(body).toEqual({ prop: 'foo', enumProp: 'enumMember', unionProp: 'bar' });
        return {
          statusCode: 200,
          body: { prop: 'foo', enumProp: 'enumMember', unionProp: 'bar' },
        };
      },
    };

    const operations = {
      added: addedOps,
      interfacev2: interfacev2Ops,
    };

    const app = fastify({ logger: false });
    await app.register(async function (instance) {
      await registerRoutes(instance, operations);
    }, { prefix: '/versioning/added/api-version:v2' });

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('versioning/added', baseUrl);
    expect(status).toBe('pass');
  });
});
