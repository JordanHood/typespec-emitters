import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/special-headers/repeatability/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { Repeatability } from '../generated/special-headers/repeatability/operations/repeatability.js';

describe('SpecialHeaders.Repeatability', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const repeatabilityOps: Repeatability = {
      immediateSuccess: async function (repeatabilityRequestId, repeatabilityFirstSent) {
        expect(repeatabilityRequestId).toBeTruthy();
        expect(repeatabilityFirstSent).toBeTruthy();
        return { statusCode: 204 };
      },
    };

    const operations = {
      repeatability: repeatabilityOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('special-headers/repeatability', baseUrl, 'special*/repeatability/**/*');
    expect(status).toBe('pass');
  });
});
