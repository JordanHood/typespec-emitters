import { describe, expect, it } from 'vitest';
import { createEmitterTestRunner } from '../utils.jsx';

describe('tuple emitter output', () => {
  it('emits model with tuple properties', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      model Coordinate {
        point: [float64, float64];
        label: string;
      }

      model Response {
        data: [string, int32, boolean];
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });
});
