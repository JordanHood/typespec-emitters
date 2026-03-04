import { describe, expect, it } from 'vitest';
import { createEmitterTestRunner } from '../utils.jsx';

describe('discriminated union emitter output', () => {
  it('emits discriminated union from inheritance', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      @discriminator("kind")
      model Shape {
        kind: string;
      }

      model Circle extends Shape {
        kind: "circle";
        radius: float64;
      }

      model Square extends Shape {
        kind: "square";
        side: float64;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });

  it('emits discriminated union with additional inherited properties', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      @discriminator("type")
      model Pet {
        type: string;
        name: string;
      }

      model Cat extends Pet {
        type: "cat";
        indoor: boolean;
      }

      model Dog extends Pet {
        type: "dog";
        trained: boolean;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });
});
