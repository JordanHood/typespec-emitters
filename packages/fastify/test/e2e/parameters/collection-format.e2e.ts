import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/parameters/collection-format/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { Header } from '../generated/parameters/collection-format/operations/header.js';
import type { Query } from '../generated/parameters/collection-format/operations/query.js';

describe('Parameters.Collection-format', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const headerOps: Header = {
      csv: async function (_colors) {
        return { statusCode: 204 };
      },
    };

    const queryOps: Query = {
      multi: async function (_options) {
        return { statusCode: 204 };
      },
      ssv: async function (_options) {
        return { statusCode: 204 };
      },
      pipes: async function (_options) {
        return { statusCode: 204 };
      },
      csv: async function (_options) {
        return { statusCode: 204 };
      },
    };

    const operations = {
      header: headerOps,
      query: queryOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('parameters/collection-format', baseUrl);
    expect(status).toBe('pass');
  });
});
