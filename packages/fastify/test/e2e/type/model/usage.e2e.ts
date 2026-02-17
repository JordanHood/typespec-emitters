import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../../generated/type/model/usage/router.js';
import type { Usage } from '../../generated/type/model/usage/operations/usage.js';
import { startServer } from '../../helpers.js';
import { runScenario } from '../../spector.js';

describe('Type.Model.Usage', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const operations: Usage = {
      async input(body) {
        expect(body).toEqual({ requiredProp: 'example-value' });
        return {
          statusCode: 204,
        };
      },
      async output() {
        return {
          statusCode: 200,
          body: { requiredProp: 'example-value' },
        };
      },
      async inputAndOutput(body) {
        expect(body).toEqual({ requiredProp: 'example-value' });
        return {
          statusCode: 200,
          body: { requiredProp: 'example-value' },
        };
      },
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, { usage: operations });

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('type/model/usage', baseUrl);
    expect(status).toBe('pass');
  });
});
