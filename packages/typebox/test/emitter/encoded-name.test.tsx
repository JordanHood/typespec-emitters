import { describe, expect, it } from 'vitest';
import { createEmitterTestRunner } from '../utils.jsx';

describe('encodedName emitter output', () => {
  it('emits model with JSON wire names', async () => {
    const runner = await createEmitterTestRunner();
    await runner.compile(`
      model Certificate {
        @encodedName("application/json", "issued_at")
        issuedAt: utcDateTime;

        @encodedName("application/json", "expire_at")
        expireAt: utcDateTime;

        issuer: string;
      }
    `);

    const { text } = await runner.program.host.readFile('@typespec-dev/emitter-typebox/models.ts');
    expect(text.trim()).toMatchSnapshot();
  });
});
