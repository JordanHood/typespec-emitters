import { describe, it, expect } from 'vitest';
import { emit } from './test-host.js';

describe('fastify emitter', () => {
  it('generates router.ts with registerRoutes function', async () => {
    const results = await emit(`
      import "@typespec/http";
      using TypeSpec.Http;

      @service
      namespace TestService;

      model Item {
        id: int32;
        name: string;
      }

      @route("/items")
      interface Items {
        @get list(): Item[];
      }
    `);

    expect(results['router.ts']).toBeDefined();
    expect(results['router.ts']).toContain('registerRoutes');
    expect(results['router.ts']).toContain('FastifyInstance');
  });

  it('generates operation interfaces', async () => {
    const results = await emit(`
      import "@typespec/http";
      using TypeSpec.Http;

      @service
      namespace TestService;

      model Pet {
        id: int32;
        name: string;
      }

      @route("/pets")
      interface Pets {
        @get list(): Pet[];
        @get get(@path petId: int32): Pet;
        @post create(@body pet: Pet): Pet;
      }
    `);

    expect(results['operations/pets.ts']).toBeDefined();
    expect(results['operations/pets.ts']).toContain('interface Pets');
    expect(results['operations/pets.ts']).toContain('list');
    expect(results['operations/pets.ts']).toContain('get');
    expect(results['operations/pets.ts']).toContain('create');
  });

  it('generates route handlers', async () => {
    const results = await emit(`
      import "@typespec/http";
      using TypeSpec.Http;

      @service
      namespace TestService;

      model Item {
        id: int32;
      }

      @route("/items")
      interface Items {
        @get list(): Item[];
      }
    `);

    expect(results['routes/items.routes.ts']).toBeDefined();
    expect(results['routes/items.routes.ts']).toContain('registerItemsRoutes');
    expect(results['routes/items.routes.ts']).toContain('withTypeProvider');
  });

  it('generates model types', async () => {
    const results = await emit(`
      import "@typespec/http";
      using TypeSpec.Http;

      @service
      namespace TestService;

      model Pet {
        id: int32;
        name: string;
        age: int32;
      }

      @route("/pets")
      interface Pets {
        @get list(): Pet[];
      }
    `);

    expect(results['models/testservice.ts']).toBeDefined();
    expect(results['models/testservice.ts']).toContain('export const pet = z');
    expect(results['models/testservice.ts']).toContain('export type Pet = z.infer<typeof pet>');
  });

  it('handles path parameters correctly', async () => {
    const results = await emit(`
      import "@typespec/http";
      using TypeSpec.Http;

      @service
      namespace TestService;

      model Item {
        id: int32;
      }

      @route("/items")
      interface Items {
        @get
        @route("/{itemId}")
        get(@path itemId: int32): Item;
      }
    `);

    const routesContent = results['routes/items.routes.ts'];
    expect(routesContent).toContain('itemId');
    expect(routesContent).toContain('request.params');
  });

  it('handles query parameters as options object', async () => {
    const results = await emit(`
      import "@typespec/http";
      using TypeSpec.Http;

      @service
      namespace TestService;

      model Item {
        id: int32;
      }

      @route("/items")
      interface Items {
        @get list(@query limit?: int32, @query offset?: int32): Item[];
      }
    `);

    const operationsContent = results['operations/items.ts'];
    expect(operationsContent).toContain('options?');
    expect(operationsContent).toContain('limit?');
    expect(operationsContent).toContain('offset?');
  });

  it('handles request body correctly', async () => {
    const results = await emit(`
      import "@typespec/http";
      using TypeSpec.Http;

      @service
      namespace TestService;

      model Item {
        name: string;
      }

      @route("/items")
      interface Items {
        @post create(@body item: Item): Item;
      }
    `);

    const operationsContent = results['operations/items.ts'];
    expect(operationsContent).toContain('body: Item');

    const routesContent = results['routes/items.routes.ts'];
    expect(routesContent).toContain('request.body');
  });

  it('generates error handling in route handlers', async () => {
    const results = await emit(`
      import "@typespec/http";
      using TypeSpec.Http;

      @service
      namespace TestService;

      model Item {
        id: int32;
      }

      @route("/items")
      interface Items {
        @get list(): Item[];
      }
    `);

    const routesContent = results['routes/items.routes.ts'];
    expect(routesContent).toContain('try');
    expect(routesContent).toContain('catch');
    expect(routesContent).toContain('reply.code(500)');
  });
});
