import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/type/array/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { Int32Value } from '../generated/type/array/operations/int32value.js';
import type { Int64Value } from '../generated/type/array/operations/int64value.js';
import type { BooleanValue } from '../generated/type/array/operations/booleanvalue.js';
import type { StringValue } from '../generated/type/array/operations/stringvalue.js';
import type { Float32Value } from '../generated/type/array/operations/float32value.js';
import type { DatetimeValue } from '../generated/type/array/operations/datetimevalue.js';
import type { DurationValue } from '../generated/type/array/operations/durationvalue.js';
import type { UnknownValue } from '../generated/type/array/operations/unknownvalue.js';
import type { ModelValue } from '../generated/type/array/operations/modelvalue.js';
import type { NullableFloatValue } from '../generated/type/array/operations/nullablefloatvalue.js';
import type { NullableBooleanValue } from '../generated/type/array/operations/nullablebooleanvalue.js';
import type { NullableInt32Value } from '../generated/type/array/operations/nullableint32value.js';
import type { NullableStringValue } from '../generated/type/array/operations/nullablestringvalue.js';
import type { NullableModelValue } from '../generated/type/array/operations/nullablemodelvalue.js';

describe('Type.Array', () => {
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
        return {
          statusCode: 200,
          body: [1, 2],
        };
      },
      put: async function (body: Array<number>) {
        return {
          statusCode: 204,
        };
      },
    };

    const int64ValueOps: Int64Value = {
      get: async function () {
        return {
          statusCode: 200,
          body: [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER] as unknown as Array<bigint>,
        };
      },
      put: async function (body: Array<bigint>) {
        return {
          statusCode: 204,
        };
      },
    };

    const booleanValueOps: BooleanValue = {
      get: async function () {
        return {
          statusCode: 200,
          body: [true, false],
        };
      },
      put: async function (body: Array<boolean>) {
        return {
          statusCode: 204,
        };
      },
    };

    const stringValueOps: StringValue = {
      get: async function () {
        return {
          statusCode: 200,
          body: ['hello', ''],
        };
      },
      put: async function (body: Array<string>) {
        return {
          statusCode: 204,
        };
      },
    };

    const float32ValueOps: Float32Value = {
      get: async function () {
        return {
          statusCode: 200,
          body: [43.125],
        };
      },
      put: async function (body: Array<number>) {
        return {
          statusCode: 204,
        };
      },
    };

    const datetimeValueOps: DatetimeValue = {
      get: async function () {
        return {
          statusCode: 200,
          body: ['2022-08-26T18:38:00Z'] as unknown as Array<Date>,
        };
      },
      put: async function (body: Array<Date>) {
        return {
          statusCode: 204,
        };
      },
    };

    const durationValueOps: DurationValue = {
      get: async function () {
        return {
          statusCode: 200,
          body: ['P123DT22H14M12.011S'],
        };
      },
      put: async function (body: Array<string>) {
        return {
          statusCode: 204,
        };
      },
    };

    const unknownValueOps: UnknownValue = {
      get: async function () {
        return {
          statusCode: 200,
          body: [1, 'hello', null],
        };
      },
      put: async function (body: Array<unknown>) {
        return {
          statusCode: 204,
        };
      },
    };

    const modelValueOps: ModelValue = {
      get: async function () {
        return {
          statusCode: 200,
          body: [{ property: 'hello' }, { property: 'world' }],
        };
      },
      put: async function (body) {
        return {
          statusCode: 204,
        };
      },
    };

    const nullableFloatValueOps: NullableFloatValue = {
      get: async function () {
        return {
          statusCode: 200,
          body: [1.25, null, 3.0],
        };
      },
      put: async function (body) {
        return {
          statusCode: 204,
        };
      },
    };

    const nullableBooleanValueOps: NullableBooleanValue = {
      get: async function () {
        return {
          statusCode: 200,
          body: [true, null, false],
        };
      },
      put: async function (body) {
        return {
          statusCode: 204,
        };
      },
    };

    const nullableInt32ValueOps: NullableInt32Value = {
      get: async function () {
        return {
          statusCode: 200,
          body: [1, null, 3],
        };
      },
      put: async function (body) {
        return {
          statusCode: 204,
        };
      },
    };

    const nullableStringValueOps: NullableStringValue = {
      get: async function () {
        return {
          statusCode: 200,
          body: ['hello', null, 'world'],
        };
      },
      put: async function (body) {
        return {
          statusCode: 204,
        };
      },
    };

    const nullableModelValueOps: NullableModelValue = {
      get: async function () {
        return {
          statusCode: 200,
          body: [{ property: 'hello' }, null, { property: 'world' }],
        };
      },
      put: async function (body) {
        return {
          statusCode: 204,
        };
      },
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
      nullablefloatvalue: nullableFloatValueOps,
      nullablebooleanvalue: nullableBooleanValueOps,
      nullableint32value: nullableInt32ValueOps,
      nullablestringvalue: nullableStringValueOps,
      nullablemodelvalue: nullableModelValueOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('type/array', baseUrl);
    expect(status).toBe('pass');
  });
});
