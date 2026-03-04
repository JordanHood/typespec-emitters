import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/response/status-code-range/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { StatusCodeRange } from '../generated/response/status-code-range/operations/statuscoderange.js';

describe('Response.StatusCodeRange', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const statuscoderangeOps: StatusCodeRange = {
      errorResponseStatusCodeInRange: async function () {
        return { statusCode: 494 };
      },
      errorResponseStatusCode404: async function () {
        return { statusCode: 404 };
      },
    };

    const operations = {
      statuscoderange: statuscoderangeOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario(
      'response/status-code-range',
      baseUrl,
      'response/status*/**/*'
    );
    expect(status).toBe('pass');
  });
});
