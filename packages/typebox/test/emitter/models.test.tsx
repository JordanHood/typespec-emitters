import { describe, expect, it } from 'vitest';
import { createEmitterTestRunner } from '../utils.jsx';

describe('model emitter output', () => {
  it('emits models with arrays, optional props, and nested references', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      model Address {
        street: string;
        city: string;
        zip?: string;
      }

      model User {
        name: string;
        age?: int32;
        tags: string[];
        address: Address;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });

  it('emits empty model', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      model Empty {}
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });
});
