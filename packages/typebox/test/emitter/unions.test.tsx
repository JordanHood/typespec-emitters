import { describe, expect, it } from 'vitest';
import { createEmitterTestRunner } from '../utils.jsx';

describe('union and nullable emitter output', () => {
  it('emits named union types', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      union Status {
        active: "active",
        inactive: "inactive",
      }

      union Result {
        success: string,
        error: int32,
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });

  it('emits model with nullable properties', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      model Profile {
        name: string;
        bio: string | null;
        age?: int32 | null;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });
});
