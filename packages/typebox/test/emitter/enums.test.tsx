import { describe, expect, it } from 'vitest';
import { createEmitterTestRunner } from '../utils.jsx';

describe('enum emitter output', () => {
  it('emits string enum', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      enum Direction {
        Up,
        Down,
        Left,
        Right,
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });

  it('emits numeric enum', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      enum Priority {
        Low: 0,
        Medium: 1,
        High: 2,
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });

  it('emits string enum with custom values', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      enum Color {
        Red: "red",
        Green: "green",
        Blue: "blue",
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });
});
