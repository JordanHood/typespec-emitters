/*
 * BLOCKED: No response header generation
 *
 * Generated route handler doesn't set response headers. Response models with @header properties
 * (e.g. repeatability-result) are ignored -- reply.code(statusCode).send() never calls
 * reply.header().
 *
 * Fix requires: Read @header properties from response models in RouteRegistration.tsx and
 * OperationInterface.tsx, generate reply.header() calls.
 */
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
        expect(repeatabilityRequestId).toBe('2378d9bc-1726-11ee-be56-0242ac120002');
        expect(repeatabilityFirstSent).toBe('Tue, 15 Nov 2022 12:45:26 GMT');
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
