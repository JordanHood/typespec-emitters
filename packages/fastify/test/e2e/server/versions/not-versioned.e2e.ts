import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../../generated/server/versions/not-versioned/router.js';
import { startServer } from '../../helpers.js';
import { runScenario } from '../../spector.js';
import type { NotVersioned } from '../../generated/server/versions/not-versioned/operations/notversioned.js';

describe('Server.Versions.NotVersioned', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const notversionedOps: NotVersioned = {
      withoutApiVersion: async function () {
        return { statusCode: 200, body: true };
      },
      withQueryApiVersion: async function (options) {
        return { statusCode: 200, body: true };
      },
      withPathApiVersion: async function (apiVersion) {
        return { statusCode: 200, body: true };
      },
    };

    const operations = {
      notversioned: notversionedOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('server/versions/not-versioned', baseUrl, 'server/versions/not*/**/*');
    expect(status).toBe('pass');
  });
});
