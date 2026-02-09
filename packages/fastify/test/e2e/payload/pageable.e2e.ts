import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/payload/pageable/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { ServerDrivenPagination } from '../generated/payload/pageable/operations/serverdrivenpagination.js';
import type { ContinuationToken } from '../generated/payload/pageable/operations/continuationtoken.js';
import type { PageSize } from '../generated/payload/pageable/operations/pagesize.js';
import type { Pet } from '../generated/payload/pageable/models/pageable.js';

describe('Payload.Pageable', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const FirstPage: Pet[] = [
      { id: '1', name: 'dog' },
      { id: '2', name: 'cat' },
    ];

    const SecondPage: Pet[] = [
      { id: '3', name: 'bird' },
      { id: '4', name: 'fish' },
    ];

    const AllPets: Pet[] = [
      { id: '1', name: 'dog' },
      { id: '2', name: 'cat' },
      { id: '3', name: 'bird' },
      { id: '4', name: 'fish' },
    ];

    const serverdrivenpagination: ServerDrivenPagination = {
      link: async function () {
        return {
          pets: FirstPage,
          next: '/payload/pageable/server-driven-pagination/link/nextPage',
        };
      },

      linkString: async function () {
        return {
          pets: FirstPage,
          next: '/payload/pageable/server-driven-pagination/link-string/nextPage',
        };
      },

      nestedLink: async function () {
        return {
          nestedItems: {
            pets: FirstPage,
          },
          nestedNext: {
            next: '/payload/pageable/server-driven-pagination/nested-link/nextPage',
          },
        };
      },
    };

    const continuationtoken: ContinuationToken = {
      requestQueryResponseBody: async function (foo, options) {
        const token = options?.token;
        if (token === 'page2') {
          return {
            pets: SecondPage,
          };
        }
        return {
          pets: FirstPage,
          nextToken: 'page2',
        };
      },

      requestHeaderResponseBody: async function (token, foo, options) {
        if (token === 'page2') {
          return {
            pets: SecondPage,
          };
        }
        return {
          pets: FirstPage,
          nextToken: 'page2',
        };
      },

      requestQueryResponseHeader: async function (foo, options) {
        const token = options?.token;
        if (token === 'page2') {
          return {
            pets: SecondPage,
          };
        }
        return {
          pets: FirstPage,
          nextToken: 'page2',
        };
      },

      requestHeaderResponseHeader: async function (token, foo, options) {
        if (token === 'page2') {
          return {
            pets: SecondPage,
          };
        }
        return {
          pets: FirstPage,
          nextToken: 'page2',
        };
      },

      requestQueryNestedResponseBody: async function (foo, options) {
        const token = options?.token;
        if (token === 'page2') {
          return {
            nestedItems: {
              pets: SecondPage,
            },
          };
        }
        return {
          nestedItems: {
            pets: FirstPage,
          },
          nestedNext: {
            nextToken: 'page2',
          },
        };
      },

      requestHeaderNestedResponseBody: async function (token, foo, options) {
        if (token === 'page2') {
          return {
            nestedItems: {
              pets: SecondPage,
            },
          };
        }
        return {
          nestedItems: {
            pets: FirstPage,
          },
          nestedNext: {
            nextToken: 'page2',
          },
        };
      },
    };

    const pagesize: PageSize = {
      listWithoutContinuation: async function () {
        return {
          pets: AllPets,
        };
      },

      listWithPageSize: async function (options) {
        const size = options?.pageSize;
        if (size === 2) {
          return {
            pets: FirstPage,
          };
        }
        if (size === 4) {
          return {
            pets: AllPets,
          };
        }
        return {
          pets: AllPets,
        };
      },
    };

    const operations = {
      serverdrivenpagination,
      continuationtoken,
      pagesize,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('payload/pageable', baseUrl);
    expect(status).toBe('pass');
  });
});
