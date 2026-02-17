import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/type/union/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { StringsOnly } from '../generated/type/union/operations/stringsonly.js';
import type { StringExtensible } from '../generated/type/union/operations/stringextensible.js';
import type { StringExtensibleNamed } from '../generated/type/union/operations/stringextensiblenamed.js';
import type { IntsOnly } from '../generated/type/union/operations/intsonly.js';
import type { FloatsOnly } from '../generated/type/union/operations/floatsonly.js';
import type { ModelsOnly } from '../generated/type/union/operations/modelsonly.js';
import type { EnumsOnly } from '../generated/type/union/operations/enumsonly.js';
import type { StringAndArray } from '../generated/type/union/operations/stringandarray.js';
import type { MixedLiterals } from '../generated/type/union/operations/mixedliterals.js';
import type { MixedTypes } from '../generated/type/union/operations/mixedtypes.js';

describe('Type.Union', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const stringsOnlyOps: StringsOnly = {
      get: async function () {
        return { statusCode: 200, body: { prop: 'b' } };
      },
      send: async function (body) {
        expect(body).toEqual({ prop: 'b' });
        return { statusCode: 204 };
      },
    };

    const stringExtensibleOps: StringExtensible = {
      get: async function () {
        return { statusCode: 200, body: { prop: 'custom' } };
      },
      send: async function (body) {
        expect(body).toEqual({ prop: 'custom' });
        return { statusCode: 204 };
      },
    };

    const stringExtensibleNamedOps: StringExtensibleNamed = {
      get: async function () {
        return { statusCode: 200, body: { prop: 'custom' } };
      },
      send: async function (body) {
        expect(body).toEqual({ prop: 'custom' });
        return { statusCode: 204 };
      },
    };

    const intsOnlyOps: IntsOnly = {
      get: async function () {
        return { statusCode: 200, body: { prop: 2 } };
      },
      send: async function (body) {
        expect(body).toEqual({ prop: 2 });
        return { statusCode: 204 };
      },
    };

    const floatsOnlyOps: FloatsOnly = {
      get: async function () {
        return { statusCode: 200, body: { prop: 2.2 } };
      },
      send: async function (body) {
        expect(body).toEqual({ prop: 2.2 });
        return { statusCode: 204 };
      },
    };

    const modelsOnlyOps: ModelsOnly = {
      get: async function () {
        return { statusCode: 200, body: { prop: { name: 'test' } } };
      },
      send: async function (body) {
        expect(body).toEqual({ prop: { name: 'test' } });
        return { statusCode: 204 };
      },
    };

    const enumsOnlyOps: EnumsOnly = {
      get: async function () {
        return {
          statusCode: 200,
          body: {
            prop: {
              lr: 'right',
              ud: 'up',
            },
          },
        };
      },
      send: async function (body) {
        expect(body).toEqual({ prop: { lr: 'right', ud: 'up' } });
        return { statusCode: 204 };
      },
    };

    const stringAndArrayOps: StringAndArray = {
      get: async function () {
        return {
          statusCode: 200,
          body: {
            prop: {
              string: 'test',
              array: ['test1', 'test2'],
            },
          },
        };
      },
      send: async function (body) {
        expect(body).toEqual({ prop: { string: 'test', array: ['test1', 'test2'] } });
        return { statusCode: 204 };
      },
    };

    const mixedLiteralsOps: MixedLiterals = {
      get: async function () {
        return {
          statusCode: 200,
          body: {
            prop: {
              stringLiteral: 'a',
              intLiteral: 2,
              floatLiteral: 3.3,
              booleanLiteral: true,
            },
          },
        };
      },
      send: async function (body) {
        expect(body).toEqual({
          prop: {
            stringLiteral: 'a',
            intLiteral: 2,
            floatLiteral: 3.3,
            booleanLiteral: true,
          },
        });
        return { statusCode: 204 };
      },
    };

    const mixedTypesOps: MixedTypes = {
      get: async function () {
        return {
          statusCode: 200,
          body: {
            prop: {
              model: { name: 'test' },
              literal: 'a',
              int: 2,
              boolean: true,
              array: [{ name: 'test' }, 'a', 2, true],
            },
          },
        };
      },
      send: async function (body) {
        expect(body).toEqual({
          prop: {
            model: { name: 'test' },
            literal: 'a',
            int: 2,
            boolean: true,
            array: [{ name: 'test' }, 'a', 2, true],
          },
        });
        return { statusCode: 204 };
      },
    };

    const operations = {
      stringsonly: stringsOnlyOps,
      stringextensible: stringExtensibleOps,
      stringextensiblenamed: stringExtensibleNamedOps,
      intsonly: intsOnlyOps,
      floatsonly: floatsOnlyOps,
      modelsonly: modelsOnlyOps,
      enumsonly: enumsOnlyOps,
      stringandarray: stringAndArrayOps,
      mixedliterals: mixedLiteralsOps,
      mixedtypes: mixedTypesOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('type/union', baseUrl, 'type/union/!(discriminated)/**');
    expect(status).toBe('pass');
  });
});
