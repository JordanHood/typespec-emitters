import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../../generated/server/endpoint/not-defined/router.js';
import { startServer } from '../../helpers.js';
import { runScenario } from '../../spector.js';
import type { NotDefined } from '../../generated/server/endpoint/not-defined/operations/notdefined.js';

describe('Server.Endpoint.NotDefined', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const notdefinedOps: NotDefined = {
      valid: async function () {
        return { statusCode: 200, body: true };
      },
    };

    const operations = {
      notdefined: notdefinedOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario(
      'server/endpoint/not-defined',
      baseUrl,
      'server/endpoint/not*/**/*'
    );
    expect(status).toBe('pass');
  });
});
