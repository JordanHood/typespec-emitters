import { ModelProperty } from '@typespec/compiler';
import { describe, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

describe('tuples', () => {
  it('works with pair of strings', async () => {
    const runner = await createTestRunner();
    const { pair } = (await runner.compile(`
      model Test {
        @test pair: [string, string];
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={pair.type} />,
      'Type.Tuple([Type.String(), Type.String()])'
    );
  });

  it('works with mixed types', async () => {
    const runner = await createTestRunner();
    const { mixed } = (await runner.compile(`
      model Test {
        @test mixed: [string, int32, boolean];
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={mixed.type} />,
      'Type.Tuple([\n  Type.String(),\n  Type.Integer({\n    minimum: -2147483648,\n    maximum: 2147483647\n  }),\n  Type.Boolean()\n])'
    );
  });

  it('works with single element', async () => {
    const runner = await createTestRunner();
    const { single } = (await runner.compile(`
      model Test {
        @test single: [string];
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={single.type} />,
      'Type.Tuple([Type.String()])'
    );
  });

  it('works with nested array element', async () => {
    const runner = await createTestRunner();
    const { nested } = (await runner.compile(`
      model Test {
        @test nested: [string, string[]];
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={nested.type} />,
      'Type.Tuple([Type.String(), Type.Array(Type.String())])'
    );
  });
});
