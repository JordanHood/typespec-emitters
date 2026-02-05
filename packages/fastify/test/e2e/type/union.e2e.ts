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
import { Lr, Ud } from '../generated/type/union/models/union.js';

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
        return { prop: 'b' };
      },
      send: async function (body) {},
    };

    const stringExtensibleOps: StringExtensible = {
      get: async function () {
        return { prop: 'custom' };
      },
      send: async function (body) {},
    };

    const stringExtensibleNamedOps: StringExtensibleNamed = {
      get: async function () {
        return { prop: 'custom' };
      },
      send: async function (body) {},
    };

    const intsOnlyOps: IntsOnly = {
      get: async function () {
        return { prop: 2 };
      },
      send: async function (body) {},
    };

    const floatsOnlyOps: FloatsOnly = {
      get: async function () {
        return { prop: 2.2 };
      },
      send: async function (body) {},
    };

    const modelsOnlyOps: ModelsOnly = {
      get: async function () {
        return { prop: { name: 'test' } };
      },
      send: async function (body) {},
    };

    const enumsOnlyOps: EnumsOnly = {
      get: async function () {
        return {
          prop: {
            lr: Lr.Right,
            ud: Ud.Up,
          },
        };
      },
      send: async function (body) {},
    };

    const stringAndArrayOps: StringAndArray = {
      get: async function () {
        return {
          prop: {
            string: 'test',
            array: ['test1', 'test2'],
          },
        };
      },
      send: async function (body) {},
    };

    const mixedLiteralsOps: MixedLiterals = {
      get: async function () {
        return {
          prop: {
            stringLiteral: 'a',
            intLiteral: 2,
            floatLiteral: 3.3,
            booleanLiteral: true,
          },
        };
      },
      send: async function (body) {},
    };

    const mixedTypesOps: MixedTypes = {
      get: async function () {
        return {
          prop: {
            model: { name: 'test' },
            literal: 'a',
            int: 2,
            boolean: true,
            array: [{ name: 'test' }, 'a', 2, true],
          },
        };
      },
      send: async function (body) {},
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
    const { status } = await runScenario('type/union', baseUrl);
    expect(status).toBe('pass');
  });
});
