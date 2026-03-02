import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/documentation/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { Lists } from '../generated/documentation/operations/lists.js';
import type { TextFormatting } from '../generated/documentation/operations/textformatting.js';

describe('Documentation', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const listsOps: Lists = {
      bulletPointsOp: async function () {
        return { statusCode: 204 };
      },
      bulletPointsModel: async function (body) {
        expect(body.input.prop).toBe('Simple');
        return { statusCode: 204 };
      },
      numbered: async function () {
        return { statusCode: 204 };
      },
    };

    const textformattingOps: TextFormatting = {
      boldText: async function () {
        return { statusCode: 204 };
      },
      italicText: async function () {
        return { statusCode: 204 };
      },
      combinedFormatting: async function () {
        return { statusCode: 204 };
      },
    };

    const operations = {
      lists: listsOps,
      textformatting: textformattingOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('documentation', baseUrl);
    expect(status).toBe('pass');
  });
});
