import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../../generated/type/property/nullable/router.js';
import { startServer } from '../../helpers.js';
import { runScenario } from '../../spector.js';
import type { String } from '../../generated/type/property/nullable/operations/string.js';
import type { Bytes } from '../../generated/type/property/nullable/operations/bytes.js';
import type { Datetime } from '../../generated/type/property/nullable/operations/datetime.js';
import type { Duration } from '../../generated/type/property/nullable/operations/duration.js';
import type { CollectionsByte } from '../../generated/type/property/nullable/operations/collectionsbyte.js';
import type { CollectionsModel } from '../../generated/type/property/nullable/operations/collectionsmodel.js';
import type { CollectionsString } from '../../generated/type/property/nullable/operations/collectionsstring.js';

describe('Type.Property.Nullable', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const stringOps: String = {
      getNonNull: async function () {
        return {
          statusCode: 200,
          body: { requiredProperty: 'foo', nullableProperty: 'hello' },
        };
      },
      getNull: async function () {
        return {
          statusCode: 200,
          body: { requiredProperty: 'foo', nullableProperty: null },
        };
      },
      patchNonNull: async function (body, contentType) {
        expect(body).toEqual({ requiredProperty: 'foo', nullableProperty: 'hello' });
        return { statusCode: 204 };
      },
      patchNull: async function (body, contentType) {
        expect(body).toEqual({ requiredProperty: 'foo', nullableProperty: null });
        return { statusCode: 204 };
      },
    };

    const bytesOps: Bytes = {
      getNonNull: async function () {
        return {
          statusCode: 200,
          body: {
            requiredProperty: 'foo',
            nullableProperty: 'aGVsbG8sIHdvcmxkIQ==',
          },
        };
      },
      getNull: async function () {
        return {
          statusCode: 200,
          body: { requiredProperty: 'foo', nullableProperty: null },
        };
      },
      patchNonNull: async function (body, contentType) {
        expect(body).toEqual({ requiredProperty: 'foo', nullableProperty: 'aGVsbG8sIHdvcmxkIQ==' });
        return { statusCode: 204 };
      },
      patchNull: async function (body, contentType) {
        expect(body).toEqual({ requiredProperty: 'foo', nullableProperty: null });
        return { statusCode: 204 };
      },
    };

    const datetimeOps: Datetime = {
      getNonNull: async function () {
        return {
          statusCode: 200,
          body: {
            requiredProperty: 'foo',
            nullableProperty: '2022-08-26T18:38:00Z',
          },
        };
      },
      getNull: async function () {
        return {
          statusCode: 200,
          body: { requiredProperty: 'foo', nullableProperty: null },
        };
      },
      patchNonNull: async function (body, contentType) {
        expect(body).toEqual({
          requiredProperty: 'foo',
          nullableProperty: new Date('2022-08-26T18:38:00.000Z'),
        });
        return { statusCode: 204 };
      },
      patchNull: async function (body, contentType) {
        expect(body).toEqual({
          requiredProperty: 'foo',
          nullableProperty: new Date('1970-01-01T00:00:00.000Z'),
        });
        return { statusCode: 204 };
      },
    };

    const durationOps: Duration = {
      getNonNull: async function () {
        return {
          statusCode: 200,
          body: {
            requiredProperty: 'foo',
            nullableProperty: 'P123DT22H14M12.011S',
          },
        };
      },
      getNull: async function () {
        return {
          statusCode: 200,
          body: { requiredProperty: 'foo', nullableProperty: null },
        };
      },
      patchNonNull: async function (body, contentType) {
        expect(body).toEqual({
          requiredProperty: 'foo',
          nullableProperty: 'P123DT22H14M12.011S',
        });
        return { statusCode: 204 };
      },
      patchNull: async function (body, contentType) {
        expect(body).toEqual({ requiredProperty: 'foo', nullableProperty: null });
        return { statusCode: 204 };
      },
    };

    const collectionsByteOps: CollectionsByte = {
      getNonNull: async function () {
        return {
          statusCode: 200,
          body: {
            requiredProperty: 'foo',
            nullableProperty: ['aGVsbG8sIHdvcmxkIQ==', 'aGVsbG8sIHdvcmxkIQ=='],
          },
        };
      },
      getNull: async function () {
        return {
          statusCode: 200,
          body: { requiredProperty: 'foo', nullableProperty: null },
        };
      },
      patchNonNull: async function (body, contentType) {
        expect(body).toEqual({
          requiredProperty: 'foo',
          nullableProperty: ['aGVsbG8sIHdvcmxkIQ==', 'aGVsbG8sIHdvcmxkIQ=='],
        });
        return { statusCode: 204 };
      },
      patchNull: async function (body, contentType) {
        expect(body).toEqual({ requiredProperty: 'foo', nullableProperty: null });
        return { statusCode: 204 };
      },
    };

    const collectionsModelOps: CollectionsModel = {
      getNonNull: async function () {
        return {
          statusCode: 200,
          body: {
            requiredProperty: 'foo',
            nullableProperty: [{ property: 'hello' }, { property: 'world' }],
          },
        };
      },
      getNull: async function () {
        return {
          statusCode: 200,
          body: { requiredProperty: 'foo', nullableProperty: null },
        };
      },
      patchNonNull: async function (body, contentType) {
        expect(body).toEqual({
          requiredProperty: 'foo',
          nullableProperty: [{ property: 'hello' }, { property: 'world' }],
        });
        return { statusCode: 204 };
      },
      patchNull: async function (body, contentType) {
        expect(body).toEqual({ requiredProperty: 'foo', nullableProperty: null });
        return { statusCode: 204 };
      },
    };

    const collectionsStringOps: CollectionsString = {
      getNonNull: async function () {
        return {
          statusCode: 200,
          body: {
            requiredProperty: 'foo',
            nullableProperty: ['hello', 'world'],
          },
        };
      },
      getNull: async function () {
        return {
          statusCode: 200,
          body: { requiredProperty: 'foo', nullableProperty: null },
        };
      },
      patchNonNull: async function (body, contentType) {
        expect(body).toEqual({
          requiredProperty: 'foo',
          nullableProperty: ['hello', 'world'],
        });
        return { statusCode: 204 };
      },
      patchNull: async function (body, contentType) {
        expect(body).toEqual({ requiredProperty: 'foo', nullableProperty: null });
        return { statusCode: 204 };
      },
    };

    const operations = {
      string: stringOps,
      bytes: bytesOps,
      datetime: datetimeOps,
      duration: durationOps,
      collectionsbyte: collectionsByteOps,
      collectionsmodel: collectionsModelOps,
      collectionsstring: collectionsStringOps,
    };

    const app = fastify({ logger: false });
    app.addContentTypeParser(
      'application/merge-patch+json',
      { parseAs: 'string' },
      function (req, body, done) {
        try {
          done(null, JSON.parse(body as string));
        } catch (err) {
          done(err as Error, undefined);
        }
      }
    );
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('type/property/nullable', baseUrl);
    expect(status).toBe('pass');
  });
});
