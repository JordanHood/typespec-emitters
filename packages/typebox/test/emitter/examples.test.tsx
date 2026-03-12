import { describe, expect, it } from 'vitest';
import { createEmitterTestRunner } from '../utils.jsx';

describe('example emitter output', () => {
  it('emits model with single example', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      @example(#{ name: "Alice", age: 30 })
      model User {
        name: string;
        age: int32;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });

  it('emits model with multiple examples', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      @example(#{ name: "Alice", age: 30 })
      @example(#{ name: "Bob", age: 25 })
      model User {
        name: string;
        age: int32;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });

  it('emits model without example unchanged', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      model User {
        name: string;
        age: int32;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });
});
