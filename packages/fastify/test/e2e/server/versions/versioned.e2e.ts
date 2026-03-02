import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../../generated/server/versions/versioned/router.js';
import { startServer } from '../../helpers.js';
import { runScenario } from '../../spector.js';
import type { Versioned } from '../../generated/server/versions/versioned/operations/versioned.js';

describe('Server.Versions.Versioned', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const versionedOps: Versioned = {
      withoutApiVersion: async function () {
        return { statusCode: 200, body: true };
      },
      withQueryApiVersion: async function (options) {
        return { statusCode: 200, body: true };
      },
      withPathApiVersion: async function (apiVersion) {
        return { statusCode: 200, body: true };
      },
      withQueryOldApiVersion: async function (options) {
        return { statusCode: 200, body: true };
      },
    };

    const operations = {
      versioned: versionedOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('server/versions/versioned', baseUrl, 'server/versions/versioned/**/*');
    expect(status).toBe('pass');
  });
});
