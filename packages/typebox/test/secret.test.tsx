import { ModelProperty } from '@typespec/compiler';
import { describe, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

describe('secret', () => {
  it('emits writeOnly: true on a secret property', async () => {
    const runner = await createTestRunner();
    const { password } = (await runner.compile(`
      model Test {
        @test @secret password: string;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={password} />,
      'Type.String({\n  writeOnly: true\n})'
    );
  });

  it('emits writeOnly: true combined with @minLength constraint', async () => {
    const runner = await createTestRunner();
    const { password } = (await runner.compile(`
      model Test {
        @test @secret @minLength(8) password: string;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={password} />,
      'Type.String({\n  minLength: 8,\n  writeOnly: true\n})'
    );
  });

  it('emits writeOnly: true on a secret int32 property', async () => {
    const runner = await createTestRunner();
    const { pin } = (await runner.compile(`
      model Test {
        @test @secret pin: int32;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={pin} />,
      'Type.Integer({\n  minimum: -2147483648,\n  maximum: 2147483647,\n  writeOnly: true\n})'
    );
  });

  it('emits writeOnly: true when @secret is on a custom scalar extending string', async () => {
    const runner = await createTestRunner();
    const { token } = (await runner.compile(`
      @secret scalar ApiToken extends string;

      model Test {
        @test token: ApiToken;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={token} />,
      'Type.String({\n  writeOnly: true\n})'
    );
  });
});
