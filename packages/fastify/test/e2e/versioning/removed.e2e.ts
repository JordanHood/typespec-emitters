import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/versioning/removed/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { Removed } from '../generated/versioning/removed/operations/removed.js';
import type { InterfaceV1 } from '../generated/versioning/removed/operations/interfacev1.js';

describe('Versioning.Removed', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const removedOps: Removed = {
      v1: async function (body) {
        expect(body).toEqual({ prop: 'foo', enumProp: 'enumMember', unionProp: 'bar' });
        return {
          statusCode: 200,
          body: { prop: 'foo', enumProp: 'enumMember', unionProp: 'bar' },
        };
      },
      v2: async function (body) {
        expect(body).toEqual({ prop: 'foo', enumProp: 'enumMemberV2', unionProp: 'bar' });
        return {
          statusCode: 200,
          body: { prop: 'foo', enumProp: 'enumMemberV2', unionProp: 'bar' },
        };
      },
      modelV3: async function (body) {
        expect(body).toEqual({ id: '123', enumProp: 'enumMemberV1' });
        return {
          statusCode: 200,
          body: { id: '123', enumProp: 'enumMemberV1' },
        };
      },
    };

    const interfacev1Ops: InterfaceV1 = {
      v1InInterface: async function (body) {
        expect(body).toEqual({ prop: 'foo', enumProp: 'enumMember', unionProp: 'bar' });
        return {
          statusCode: 200,
          body: { prop: 'foo', enumProp: 'enumMember', unionProp: 'bar' },
        };
      },
    };

    const operations = {
      removed: removedOps,
      interfacev1: interfacev1Ops,
    };

    const app = fastify({ logger: false });
    await app.register(async function (instance) {
      await registerRoutes(instance, operations);
    }, { prefix: '/versioning/removed/api-version:v2' });

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('versioning/removed', baseUrl);
    expect(status).toBe('pass');
  });
});
