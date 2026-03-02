import { describe, expect, it } from 'vitest';
import { createEmitterTestRunner } from '../utils.jsx';

describe('inheritance emitter output', () => {
  it('emits single inheritance with Intersect', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      model Animal {
        name: string;
        age: int32;
      }

      model Dog extends Animal {
        breed: string;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });

  it('emits multi-level inheritance', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      model Base {
        id: string;
      }

      model Middle extends Base {
        name: string;
      }

      model Leaf extends Middle {
        extra: int32;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });

  it('emits empty extension', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      model Animal {
        name: string;
      }

      model EmptyDog extends Animal {}
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });
});
