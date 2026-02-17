import { Union } from '@typespec/compiler';
import { describe, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

describe('unions', () => {
  it('works with simple union', async () => {
    const runner = await createTestRunner();
    const { MyUnion } = (await runner.compile(`
      @test union MyUnion {
        a: string,
        b: int32,
      }
    `)) as Record<string, Union>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={MyUnion} />,
      'Type.Union([Type.String(), Type.Integer()])'
    );
  });

  it('works with multi-variant union', async () => {
    const runner = await createTestRunner();
    const { Status } = (await runner.compile(`
      @test union Status {
        active: "active",
        inactive: "inactive",
        pending: "pending",
        archived: "archived",
      }
    `)) as Record<string, Union>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Status} />,
      'Type.Union([\n  Type.Literal("active"),\n  Type.Literal("inactive"),\n  Type.Literal("pending"),\n  Type.Literal("archived")\n])'
    );
  });

  it('works with union of boolean and string', async () => {
    const runner = await createTestRunner();
    const { Mixed } = (await runner.compile(`
      @test union Mixed {
        a: boolean,
        b: string,
      }
    `)) as Record<string, Union>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Mixed} />,
      'Type.Union([Type.Boolean(), Type.String()])'
    );
  });
});
