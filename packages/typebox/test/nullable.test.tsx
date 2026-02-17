import { Model } from '@typespec/compiler';
import { describe, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

describe('nullable', () => {
  it('works with nullable string property', async () => {
    const runner = await createTestRunner();
    const { NullModel } = (await runner.compile(`
      @test model NullModel {
        name: string | null;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={NullModel} />,
      'Type.Object({\n  name: Type.Union([Type.String(), Type.Null()]),\n})'
    );
  });

  it('works with nullable integer property', async () => {
    const runner = await createTestRunner();
    const { NullInt } = (await runner.compile(`
      @test model NullInt {
        count: int32 | null;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={NullInt} />,
      'Type.Object({\n  count: Type.Union([Type.Integer(), Type.Null()]),\n})'
    );
  });

  it('works with optional nullable property', async () => {
    const runner = await createTestRunner();
    const { OptNull } = (await runner.compile(`
      @test model OptNull {
        value?: string | null;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={OptNull} />,
      'Type.Object({\n  value: Type.Optional(Type.Union([Type.String(), Type.Null()])),\n})'
    );
  });
});
