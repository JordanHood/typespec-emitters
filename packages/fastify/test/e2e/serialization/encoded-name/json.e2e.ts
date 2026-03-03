/*
 * BLOCKED: No @encodedName wire format support
 *
 * @encodedName("application/json", "wireName") decorator not applied. Zod schema uses TS
 * property name `defaultName` but spector sends/expects wire name `wireName`.
 *
 * Fix requires: Read @encodedName decorators, generate Zod .transform() wrappers for
 * wire<->TS name mapping, or upstream fix in typespec-zod ZodSchema component.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../../generated/serialization/encoded-name/json/router.js';
import { startServer } from '../../helpers.js';
import { runScenario } from '../../spector.js';
import type { Property } from '../../generated/serialization/encoded-name/json/operations/property.js';
import type { JsonEncodedNameModel } from '../../generated/serialization/encoded-name/json/models/json.js';

describe('Serialization.EncodedName.Json', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const propertyOps: Property = {
      send: async function (body: JsonEncodedNameModel) {
        expect(body.defaultName).toBe(true);
        return { statusCode: 204 };
      },
      get: async function () {
        return {
          statusCode: 200,
          body: { defaultName: true },
        };
      },
    };

    const operations = {
      property: propertyOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('serialization/encoded-name/json', baseUrl, 'serialization/encoded*/**/*');
    expect(status).toBe('pass');
  });
});
