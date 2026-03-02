import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from 'fastify';
import { registerRoutes } from '../generated/special-words/router.js';
import { startServer } from '../helpers.js';
import { runScenario } from '../spector.js';
import type { ModelProperties } from '../generated/special-words/operations/modelproperties.js';
import type { Models } from '../generated/special-words/operations/models.js';
import type { Operations } from '../generated/special-words/operations/operations.js';
import type { Parameters } from '../generated/special-words/operations/parameters.js';

function createNoContentHandler() {
  return async function () {
    return { statusCode: 204 };
  };
}

describe('SpecialWords', () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it('passes all scenarios', async () => {
    const modelpropertiesOps: ModelProperties = {
      sameAsModel: async function (body) {
        expect(body.SameAsModel).toBe('ok');
        return { statusCode: 204 };
      },
      dictMethods: async function (body) {
        expect(body.keys).toBe('ok');
        return { statusCode: 204 };
      },
    };

    const modelsOps: Models = {
      withAnd: createNoContentHandler(),
      withAs: createNoContentHandler(),
      withAssert: createNoContentHandler(),
      withAsync: createNoContentHandler(),
      withAwait: createNoContentHandler(),
      withBreak: createNoContentHandler(),
      withClass: createNoContentHandler(),
      withConstructor: createNoContentHandler(),
      withContinue: createNoContentHandler(),
      withDef: createNoContentHandler(),
      withDel: createNoContentHandler(),
      withElif: createNoContentHandler(),
      withElse: createNoContentHandler(),
      withExcept: createNoContentHandler(),
      withExec: createNoContentHandler(),
      withFinally: createNoContentHandler(),
      withFor: createNoContentHandler(),
      withFrom: createNoContentHandler(),
      withGlobal: createNoContentHandler(),
      withIf: createNoContentHandler(),
      withImport: createNoContentHandler(),
      withIn: createNoContentHandler(),
      withIs: createNoContentHandler(),
      withLambda: createNoContentHandler(),
      withNot: createNoContentHandler(),
      withOr: createNoContentHandler(),
      withPass: createNoContentHandler(),
      withRaise: createNoContentHandler(),
      withReturn: createNoContentHandler(),
      withTry: createNoContentHandler(),
      withWhile: createNoContentHandler(),
      withWith: createNoContentHandler(),
      withYield: createNoContentHandler(),
    };

    const operationsOps: Operations = {
      and: createNoContentHandler(),
      as_: createNoContentHandler(),
      assert: createNoContentHandler(),
      async: createNoContentHandler(),
      await_: createNoContentHandler(),
      break_: createNoContentHandler(),
      class_: createNoContentHandler(),
      constructor: createNoContentHandler(),
      continue_: createNoContentHandler(),
      def: createNoContentHandler(),
      del: createNoContentHandler(),
      elif: createNoContentHandler(),
      else_: createNoContentHandler(),
      except: createNoContentHandler(),
      exec: createNoContentHandler(),
      finally_: createNoContentHandler(),
      for_: createNoContentHandler(),
      from: createNoContentHandler(),
      global: createNoContentHandler(),
      if_: createNoContentHandler(),
      import_: createNoContentHandler(),
      in_: createNoContentHandler(),
      is: createNoContentHandler(),
      lambda: createNoContentHandler(),
      not: createNoContentHandler(),
      or: createNoContentHandler(),
      pass: createNoContentHandler(),
      raise: createNoContentHandler(),
      return_: createNoContentHandler(),
      try_: createNoContentHandler(),
      while_: createNoContentHandler(),
      with_: createNoContentHandler(),
      yield_: createNoContentHandler(),
    };

    const parametersOps: Parameters = {
      withAnd: createNoContentHandler(),
      withAs: createNoContentHandler(),
      withAssert: createNoContentHandler(),
      withAsync: createNoContentHandler(),
      withAwait: createNoContentHandler(),
      withBreak: createNoContentHandler(),
      withClass: createNoContentHandler(),
      withConstructor: createNoContentHandler(),
      withContinue: createNoContentHandler(),
      withDef: createNoContentHandler(),
      withDel: createNoContentHandler(),
      withElif: createNoContentHandler(),
      withElse: createNoContentHandler(),
      withExcept: createNoContentHandler(),
      withExec: createNoContentHandler(),
      withFinally: createNoContentHandler(),
      withFor: createNoContentHandler(),
      withFrom: createNoContentHandler(),
      withGlobal: createNoContentHandler(),
      withIf: createNoContentHandler(),
      withImport: createNoContentHandler(),
      withIn: createNoContentHandler(),
      withIs: createNoContentHandler(),
      withLambda: createNoContentHandler(),
      withNot: createNoContentHandler(),
      withOr: createNoContentHandler(),
      withPass: createNoContentHandler(),
      withRaise: createNoContentHandler(),
      withReturn: createNoContentHandler(),
      withTry: createNoContentHandler(),
      withWhile: createNoContentHandler(),
      withWith: createNoContentHandler(),
      withYield: createNoContentHandler(),
      withCancellationToken: createNoContentHandler(),
    };

    const operations = {
      models: modelsOps,
      modelproperties: modelpropertiesOps,
      operations: operationsOps,
      parameters: parametersOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario('special-words', baseUrl, 'special-words/**/*');
    expect(status).toBe('pass');
  });
});
