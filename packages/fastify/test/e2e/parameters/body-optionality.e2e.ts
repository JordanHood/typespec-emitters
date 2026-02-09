import { deepStrictEqual } from 'node:assert';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/parameters/body-optionality/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { BodyOptionality } from '../generated/parameters/body-optionality/operations/bodyoptionality.js';
import type { OptionalExplicit } from '../generated/parameters/body-optionality/operations/optionalexplicit.js';

describe('Parameters.Body-optionality', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const bodyOptionalityOps: BodyOptionality = {
      requiredExplicit: async function (body) {
        deepStrictEqual(body, { name: 'foo' });
        return { statusCode: 204 };
      },
      requiredImplicit: async function (body) {
        deepStrictEqual(body, { name: 'foo' });
        return { statusCode: 204 };
      },
    };

    const optionalExplicitOps: OptionalExplicit = {
      set: async function (body) {
        deepStrictEqual(body, { name: 'foo' });
        return { statusCode: 204 };
      },
      omit: async function (body) {
        deepStrictEqual(body, undefined);
        return { statusCode: 204 };
      },
    };

    const operations = {
      bodyoptionality: bodyOptionalityOps,
      optionalexplicit: optionalExplicitOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('parameters/bodyoptionality', baseUrl);
    expect(status).toBe('pass');
  });
});
