import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../../generated/type/enum/fixed/router.js';
import { startServer } from '../../helpers.js';
import { runScenario } from '../../spector.js';
import type { String } from '../../generated/type/enum/fixed/operations/string.js';
import type { DaysOfWeekEnum } from '../../generated/type/enum/fixed/models/fixed.js';

describe('Type.Enum.Fixed', () => {
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
      putKnownValue: async function (body: DaysOfWeekEnum, contentType: 'application/json') {
        expect(body).toBe('Monday');
        return {
          statusCode: 204,
        };
      },
      putUnknownValue: async function (body: DaysOfWeekEnum, contentType: 'application/json') {
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
    const { status } = await runScenario('type/enum/fixed', baseUrl);
    expect(status).toBe('pass');
  });
});
