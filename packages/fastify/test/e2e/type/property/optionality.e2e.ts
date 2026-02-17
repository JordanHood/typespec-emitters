import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../../generated/type/property/optionality/router.js';
import { startServer } from '../../helpers.js';
import { runScenario } from '../../spector.js';
import type { String } from '../../generated/type/property/optionality/operations/string.js';
import type { Bytes } from '../../generated/type/property/optionality/operations/bytes.js';
import type { Datetime } from '../../generated/type/property/optionality/operations/datetime.js';
import type { Duration } from '../../generated/type/property/optionality/operations/duration.js';
import type { PlainDate } from '../../generated/type/property/optionality/operations/plaindate.js';
import type { PlainTime } from '../../generated/type/property/optionality/operations/plaintime.js';
import type { CollectionsByte } from '../../generated/type/property/optionality/operations/collectionsbyte.js';
import type { CollectionsModel } from '../../generated/type/property/optionality/operations/collectionsmodel.js';
import type { StringLiteral } from '../../generated/type/property/optionality/operations/stringliteral.js';
import type { IntLiteral } from '../../generated/type/property/optionality/operations/intliteral.js';
import type { FloatLiteral } from '../../generated/type/property/optionality/operations/floatliteral.js';
import type { BooleanLiteral } from '../../generated/type/property/optionality/operations/booleanliteral.js';
import type { UnionStringLiteral } from '../../generated/type/property/optionality/operations/unionstringliteral.js';
import type { UnionIntLiteral } from '../../generated/type/property/optionality/operations/unionintliteral.js';
import type { UnionFloatLiteral } from '../../generated/type/property/optionality/operations/unionfloatliteral.js';
import type { RequiredAndOptional } from '../../generated/type/property/optionality/operations/requiredandoptional.js';

describe('Type.Property.Optionality', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const stringOps: String = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: 'hello' },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: 'hello' });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const bytesOps: Bytes = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: {
            property: 'aGVsbG8sIHdvcmxkIQ==',
          },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: 'aGVsbG8sIHdvcmxkIQ==' });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const datetimeOps: Datetime = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: '2022-08-26T18:38:00Z' as unknown as Date },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: new Date('2022-08-26T18:38:00.000Z') });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const durationOps: Duration = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: 'P123DT22H14M12.011S' },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: 'P123DT22H14M12.011S' });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const plainDateOps: PlainDate = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: '2022-12-12' },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: new Date('2022-12-12T00:00:00.000Z') });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const plainTimeOps: PlainTime = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: '13:06:12' },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: '13:06:12' });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const collectionsByteOps: CollectionsByte = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: {
            property: [
              'aGVsbG8sIHdvcmxkIQ==',
              'aGVsbG8sIHdvcmxkIQ==',
            ],
          },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({
          property: ['aGVsbG8sIHdvcmxkIQ==', 'aGVsbG8sIHdvcmxkIQ=='],
        });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const collectionsModelOps: CollectionsModel = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: [{ property: 'hello' }, { property: 'world' }] },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({
          property: [{ property: 'hello' }, { property: 'world' }],
        });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const stringLiteralOps: StringLiteral = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: 'hello' },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: 'hello' });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const intLiteralOps: IntLiteral = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: 1 },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: 1 });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const floatLiteralOps: FloatLiteral = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: 1.25 },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: 1.25 });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const booleanLiteralOps: BooleanLiteral = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: true },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: true });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const unionStringLiteralOps: UnionStringLiteral = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: 'world' },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: 'world' });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const unionIntLiteralOps: UnionIntLiteral = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: 2 },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: 2 });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const unionFloatLiteralOps: UnionFloatLiteral = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { property: 2.375 },
        };
      },
      getDefault: async function () {
        return {
          statusCode: 200,
          body: {},
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ property: 2.375 });
        return { statusCode: 204 };
      },
      putDefault: async function (body) {
        expect(body).toEqual({});
        return { statusCode: 204 };
      },
    };

    const requiredAndOptionalOps: RequiredAndOptional = {
      getAll: async function () {
        return {
          statusCode: 200,
          body: { optionalProperty: 'hello', requiredProperty: 42 },
        };
      },
      getRequiredOnly: async function () {
        return {
          statusCode: 200,
          body: { requiredProperty: 42 },
        };
      },
      putAll: async function (body) {
        expect(body).toEqual({ optionalProperty: 'hello', requiredProperty: 42 });
        return { statusCode: 204 };
      },
      putRequiredOnly: async function (body) {
        expect(body).toEqual({ requiredProperty: 42 });
        return { statusCode: 204 };
      },
    };

    const operations = {
      string: stringOps,
      bytes: bytesOps,
      datetime: datetimeOps,
      duration: durationOps,
      plaindate: plainDateOps,
      plaintime: plainTimeOps,
      collectionsbyte: collectionsByteOps,
      collectionsmodel: collectionsModelOps,
      stringliteral: stringLiteralOps,
      intliteral: intLiteralOps,
      floatliteral: floatLiteralOps,
      booleanliteral: booleanLiteralOps,
      unionstringliteral: unionStringLiteralOps,
      unionintliteral: unionIntLiteralOps,
      unionfloatliteral: unionFloatLiteralOps,
      requiredandoptional: requiredAndOptionalOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('type/property/optional', baseUrl);
    expect(status).toBe('pass');
  });
});
