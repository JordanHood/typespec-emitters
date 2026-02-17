import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/type/scalar/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { String } from '../generated/type/scalar/operations/string.js';
import type { Boolean } from '../generated/type/scalar/operations/boolean.js';
import type { Unknown } from '../generated/type/scalar/operations/unknown.js';
import type { DecimalType } from '../generated/type/scalar/operations/decimaltype.js';
import type { Decimal128Type } from '../generated/type/scalar/operations/decimal128type.js';
import type { DecimalVerify } from '../generated/type/scalar/operations/decimalverify.js';
import type { Decimal128Verify } from '../generated/type/scalar/operations/decimal128verify.js';

describe('Type.Scalar', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const stringOps: String = {
      get: async function () {
        return {
          statusCode: 200,
          body: 'test',
        };
      },
      put: async function (body: string, contentType: 'application/json') {
        expect(body).toBe('test');
        return {
          statusCode: 204,
        };
      },
    };

    const booleanOps: Boolean = {
      get: async function () {
        return {
          statusCode: 200,
          body: true,
        };
      },
      put: async function (body: boolean, contentType: 'application/json') {
        expect(body).toBe(true);
        return {
          statusCode: 204,
        };
      },
    };

    const unknownOps: Unknown = {
      get: async function () {
        return {
          statusCode: 200,
          body: 'test',
        };
      },
      put: async function (body: unknown, contentType: 'application/json') {
        expect(body).toBe('test');
        return {
          statusCode: 204,
        };
      },
    };

    const decimalTypeOps: DecimalType = {
      responseBody: async function () {
        return {
          statusCode: 200,
          body: 0.33333,
        };
      },
      requestBody: async function (body: number, contentType: 'application/json') {
        expect(body).toBe(0.33333);
        return {
          statusCode: 204,
        };
      },
      requestParameter: async function (options: { value: number }) {
        expect(options.value).toBe(0.33333);
        return {
          statusCode: 204,
        };
      },
    };

    const decimal128TypeOps: Decimal128Type = {
      responseBody: async function () {
        return {
          statusCode: 200,
          body: 0.33333,
        };
      },
      requestBody: async function (body: number, contentType: 'application/json') {
        expect(body).toBe(0.33333);
        return {
          statusCode: 204,
        };
      },
      requestParameter: async function (options: { value: number }) {
        expect(options.value).toBe(0.33333);
        return {
          statusCode: 204,
        };
      },
    };

    const decimalVerifyOps: DecimalVerify = {
      prepareVerify: async function () {
        return {
          statusCode: 200,
          body: [0.1, 0.1, 0.1],
        };
      },
      verify: async function (body: number, contentType: 'application/json') {
        expect(body).toBe(0.3);
        return {
          statusCode: 204,
        };
      },
    };

    const decimal128VerifyOps: Decimal128Verify = {
      prepareVerify: async function () {
        return {
          statusCode: 200,
          body: [0.1, 0.1, 0.1],
        };
      },
      verify: async function (body: number, contentType: 'application/json') {
        expect(body).toBe(0.3);
        return {
          statusCode: 204,
        };
      },
    };

    const operations = {
      string: stringOps,
      boolean: booleanOps,
      unknown: unknownOps,
      decimaltype: decimalTypeOps,
      decimal128type: decimal128TypeOps,
      decimalverify: decimalVerifyOps,
      decimal128verify: decimal128VerifyOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('type/scalar', baseUrl);
    expect(status).toBe('pass');
  });
});
