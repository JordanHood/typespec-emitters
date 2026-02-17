import { Enum } from '@typespec/compiler';
import { describe, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

describe('enums', () => {
  it('works with string enum', async () => {
    const runner = await createTestRunner();
    const { Direction } = (await runner.compile(`
      @test enum Direction {
        Up,
        Down,
        Left,
        Right,
      }
    `)) as Record<string, Enum>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Direction} />,
      'Type.Union([\n  Type.Literal("Up"),\n  Type.Literal("Down"),\n  Type.Literal("Left"),\n  Type.Literal("Right")\n])'
    );
  });

  it('works with string enum with values', async () => {
    const runner = await createTestRunner();
    const { Color } = (await runner.compile(`
      @test enum Color {
        Red: "red",
        Green: "green",
        Blue: "blue",
      }
    `)) as Record<string, Enum>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Color} />,
      'Type.Union([Type.Literal("red"), Type.Literal("green"), Type.Literal("blue")])'
    );
  });

  it('works with numeric enum', async () => {
    const runner = await createTestRunner();
    const { Priority } = (await runner.compile(`
      @test enum Priority {
        Low: 0,
        Medium: 1,
        High: 2,
      }
    `)) as Record<string, Enum>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Priority} />,
      'Type.Union([Type.Literal(0), Type.Literal(1), Type.Literal(2)])'
    );
  });
});
