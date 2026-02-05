import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/type/dictionary/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { Int32Value } from '../generated/type/dictionary/operations/int32value.js';
import type { Int64Value } from '../generated/type/dictionary/operations/int64value.js';
import type { BooleanValue } from '../generated/type/dictionary/operations/booleanvalue.js';
import type { StringValue } from '../generated/type/dictionary/operations/stringvalue.js';
import type { Float32Value } from '../generated/type/dictionary/operations/float32value.js';
import type { DatetimeValue } from '../generated/type/dictionary/operations/datetimevalue.js';
import type { DurationValue } from '../generated/type/dictionary/operations/durationvalue.js';
import type { UnknownValue } from '../generated/type/dictionary/operations/unknownvalue.js';
import type { ModelValue } from '../generated/type/dictionary/operations/modelvalue.js';
import type { RecursiveModelValue } from '../generated/type/dictionary/operations/recursivemodelvalue.js';
import type { NullableFloatValue } from '../generated/type/dictionary/operations/nullablefloatvalue.js';

describe('Type.Dictionary', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const int32ValueOps: Int32Value = {
      get: async function () {
        return { k1: 1, k2: 2 };
      },
      put: async function (body: Record<string, number>) {},
    };

    const int64ValueOps: Int64Value = {
      get: async function () {
        return {
          k1: BigInt('9223372036854775807'),
          k2: BigInt('-9223372036854775807'),
        };
      },
      put: async function (body: Record<string, bigint>) {},
    };

    const booleanValueOps: BooleanValue = {
      get: async function () {
        return { k1: true, k2: false };
      },
      put: async function (body: Record<string, boolean>) {},
    };

    const stringValueOps: StringValue = {
      get: async function () {
        return { k1: 'hello', k2: '' };
      },
      put: async function (body: Record<string, string>) {},
    };

    const float32ValueOps: Float32Value = {
      get: async function () {
        return { k1: 43.125 };
      },
      put: async function (body: Record<string, number>) {},
    };

    const datetimeValueOps: DatetimeValue = {
      get: async function () {
        return { k1: new Date('2022-08-26T18:38:00Z') };
      },
      put: async function (body: Record<string, Date>) {},
    };

    const durationValueOps: DurationValue = {
      get: async function () {
        return { k1: 'P123DT22H14M12.011S' };
      },
      put: async function (body: Record<string, string>) {},
    };

    const unknownValueOps: UnknownValue = {
      get: async function () {
        return { k1: 1, k2: 'hello', k3: null };
      },
      put: async function (body: Record<string, unknown>) {},
    };

    const modelValueOps: ModelValue = {
      get: async function () {
        return {
          k1: { property: 'hello' },
          k2: { property: 'world' },
        };
      },
      put: async function (body) {},
    };

    const recursiveModelValueOps: RecursiveModelValue = {
      get: async function () {
        return {
          k1: { property: 'hello', children: {} },
          k2: {
            property: 'world',
            children: { 'k2.1': { property: 'inner world' } },
          },
        };
      },
      put: async function (body) {},
    };

    const nullableFloatValueOps: NullableFloatValue = {
      get: async function () {
        return { k1: 1.25, k2: 0.5, k3: null };
      },
      put: async function (body) {},
    };

    const operations = {
      int32value: int32ValueOps,
      int64value: int64ValueOps,
      booleanvalue: booleanValueOps,
      stringvalue: stringValueOps,
      float32value: float32ValueOps,
      datetimevalue: datetimeValueOps,
      durationvalue: durationValueOps,
      unknownvalue: unknownValueOps,
      modelvalue: modelValueOps,
      recursivemodelvalue: recursiveModelValueOps,
      nullablefloatvalue: nullableFloatValueOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('type/dictionary', baseUrl);
    expect(status).toBe('pass');
  });
});
