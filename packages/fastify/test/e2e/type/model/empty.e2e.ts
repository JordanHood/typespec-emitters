import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../../generated/type/model/empty/router.js';
import type { Empty } from '../../generated/type/model/empty/operations/empty.js';
import { startServer } from '../../helpers.js';
import { runScenario } from '../../spector.js';

describe('Type.Model.Empty', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const operations: Empty = {
      async putEmpty(body) {
        return {
          statusCode: 204,
        };
      },
      async getEmpty() {
        return {
          statusCode: 200,
          body: {},
        };
      },
      async postRoundTripEmpty(body) {
        return {
          statusCode: 200,
          body: {},
        };
      },
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, { empty: operations });

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('type/model/empty', baseUrl);
    expect(status).toBe('pass');
  });
});
