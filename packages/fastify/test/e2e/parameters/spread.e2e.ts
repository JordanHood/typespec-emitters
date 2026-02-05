import { deepStrictEqual } from 'node:assert';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/parameters/spread/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { Alias } from '../generated/parameters/spread/operations/alias.js';
import type { Model } from '../generated/parameters/spread/operations/model.js';

describe('Parameters.Spread', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const aliasOps: Alias = {
      spreadAsRequestBody: async function (body) {
        deepStrictEqual(body, { name: 'foo' });
        return { statusCode: 204 };
      },
      spreadParameterWithInnerModel: async function (id, body, xMsTestHeader) {
        deepStrictEqual(id, '1');
        deepStrictEqual(body, { name: 'foo' });
        deepStrictEqual(xMsTestHeader, 'bar');
        return { statusCode: 204 };
      },
      spreadAsRequestParameter: async function (id, body, xMsTestHeader) {
        deepStrictEqual(id, '1');
        deepStrictEqual(body, { name: 'foo' });
        deepStrictEqual(xMsTestHeader, 'bar');
        return { statusCode: 204 };
      },
      spreadWithMultipleParameters: async function (id, body, xMsTestHeader) {
        deepStrictEqual(id, '1');
        deepStrictEqual(xMsTestHeader, 'bar');
        return { statusCode: 204 };
      },
      spreadParameterWithInnerAlias: async function (id, body, xMsTestHeader) {
        deepStrictEqual(id, '1');
        deepStrictEqual(body.name, 'foo');
        deepStrictEqual(body.age, 1);
        deepStrictEqual(xMsTestHeader, 'bar');
        return { statusCode: 204 };
      },
    };

    const modelOps: Model = {
      spreadAsRequestBody: async function (body) {
        deepStrictEqual(body, { name: 'foo' });
        return { statusCode: 204 };
      },
      spreadCompositeRequestOnlyWithBody: async function (body) {
        deepStrictEqual(body, { name: 'foo' });
        return { statusCode: 204 };
      },
      spreadCompositeRequestWithoutBody: async function (name, testHeader) {
        deepStrictEqual(name, 'foo');
        deepStrictEqual(testHeader, 'bar');
        return { statusCode: 204 };
      },
      spreadCompositeRequest: async function (name, body, testHeader) {
        deepStrictEqual(name, 'foo');
        deepStrictEqual(body, { name: 'foo' });
        deepStrictEqual(testHeader, 'bar');
        return { statusCode: 204 };
      },
      spreadCompositeRequestMix: async function (name, body, testHeader) {
        deepStrictEqual(name, 'foo');
        deepStrictEqual(body, { prop: 'foo' });
        deepStrictEqual(testHeader, 'bar');
        return { statusCode: 204 };
      },
    };

    const operations = {
      alias: aliasOps,
      model: modelOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('parameters/spread', baseUrl);
    expect(status).toBe('pass');
  });
});
