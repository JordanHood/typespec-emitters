import { Model, ModelProperty } from '@typespec/compiler';
import { describe, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

describe('arrays', () => {
  it('works with array of strings', async () => {
    const runner = await createTestRunner();
    const { stringsProp } = (await runner.compile(`
      model Test {
        @test stringsProp: string[];
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={stringsProp.type} />,
      'Type.Array(Type.String())'
    );
  });

  it('works with array of integers', async () => {
    const runner = await createTestRunner();
    const { numsProp } = (await runner.compile(`
      model Test {
        @test numsProp: int32[];
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={numsProp.type} />,
      'Type.Array(Type.Integer())'
    );
  });

  it('works with array property in model', async () => {
    const runner = await createTestRunner();
    const { ListModel } = (await runner.compile(`
      @test model ListModel {
        items: string[];
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={ListModel} />,
      'Type.Object({\n  items: Type.Array(Type.String()),\n})'
    );
  });

  it('works with array of booleans', async () => {
    const runner = await createTestRunner();
    const { flagsProp } = (await runner.compile(`
      model Test {
        @test flagsProp: boolean[];
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={flagsProp.type} />,
      'Type.Array(Type.Boolean())'
    );
  });
});
