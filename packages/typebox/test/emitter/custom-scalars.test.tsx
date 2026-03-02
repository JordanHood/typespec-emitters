import { describe, expect, it } from 'vitest';
import { createEmitterTestRunner } from '../utils.jsx';

describe('custom scalar emitter output', () => {
  it('emits custom scalars extending string used in model', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      @maxLength(255)
      scalar Email extends string;

      scalar UserId extends string;

      model User {
        id: UserId;
        email: Email;
        name: string;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });

  it('emits custom scalars extending numeric types', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      @minValue(1)
      scalar PositiveInt extends int32;

      scalar Percentage extends float64;

      model Stats {
        count: PositiveInt;
        ratio: Percentage;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });
});
