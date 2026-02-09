import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../../generated/type/enum/extensible/router.js';
import { startServer } from '../../helpers.js';
import { runScenario } from '../../spector.js';
import type { String } from '../../generated/type/enum/extensible/operations/string.js';
import type { DaysOfWeekExtensibleEnum } from '../../generated/type/enum/extensible/models/extensible.js';

describe('Type.Enum.Extensible', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const stringOps: String = {
      getKnownValue: async function () {
        return {
          statusCode: 200,
          body: 'Monday',
        };
      },
      getUnknownValue: async function () {
        return {
          statusCode: 200,
          body: 'Weekend',
        };
      },
      putKnownValue: async function (
        body: DaysOfWeekExtensibleEnum,
        contentType: 'application/json'
      ) {
        return {
          statusCode: 204,
        };
      },
      putUnknownValue: async function (
        body: DaysOfWeekExtensibleEnum,
        contentType: 'application/json'
      ) {
        return {
          statusCode: 204,
        };
      },
    };

    const operations = {
      string: stringOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('type/enum/extensible', baseUrl);
    expect(status).toBe('pass');
  });
});
