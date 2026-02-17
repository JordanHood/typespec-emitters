import { describe, expect, it } from 'vitest';
import { createEmitterTestRunner } from '../utils.jsx';

describe('record/dictionary emitter output', () => {
  it('emits models with record properties', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      model Config {
        settings: Record<string>;
        counts: Record<int32>;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });
});
