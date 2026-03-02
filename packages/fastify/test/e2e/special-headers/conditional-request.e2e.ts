import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/special-headers/conditional-request/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { ConditionalRequest } from '../generated/special-headers/conditional-request/operations/conditionalrequest.js';

describe('SpecialHeaders.ConditionalRequest', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const conditionalrequestOps: ConditionalRequest = {
      postIfMatch: async function (ifMatch) {
        expect(ifMatch).toBe('"valid"');
        return { statusCode: 204 };
      },
      postIfNoneMatch: async function (ifNoneMatch) {
        expect(ifNoneMatch).toBe('"invalid"');
        return { statusCode: 204 };
      },
      headIfModifiedSince: async function (ifModifiedSince) {
        expect(ifModifiedSince).toBeTruthy();
        return { statusCode: 204 };
      },
      postIfUnmodifiedSince: async function (ifUnmodifiedSince) {
        expect(ifUnmodifiedSince).toBeTruthy();
        return { statusCode: 204 };
      },
    };

    const operations = {
      conditionalrequest: conditionalrequestOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('special-headers/conditional-request', baseUrl, 'special*/conditional*/**/*');
    expect(status).toBe('pass');
  });
});
