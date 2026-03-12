import { Model } from '@typespec/compiler';
import { describe, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

describe('encodedName decorator', () => {
  it('uses wire name for JSON-encoded property', async () => {
    const runner = await createTestRunner();
    const { Cert } = (await runner.compile(`
      @test model Cert {
        @encodedName("application/json", "expire_at")
        expireAt: utcDateTime;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Cert} />,
      'Type.Object({\n  expire_at: Type.String({\n    format: "date-time"\n  }),\n})'
    );
  });

  it('ignores non-JSON encodedName', async () => {
    const runner = await createTestRunner();
    const { Cert } = (await runner.compile(`
      @test model Cert {
        @encodedName("application/xml", "expiry")
        expireAt: utcDateTime;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Cert} />,
      'Type.Object({\n  expireAt: Type.String({\n    format: "date-time"\n  }),\n})'
    );
  });

  it('uses wire name with constraints', async () => {
    const runner = await createTestRunner();
    const { Settings } = (await runner.compile(`
      @test model Settings {
        @encodedName("application/json", "max_retries")
        @minValue(0) @maxValue(10)
        maxRetries: int32;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Settings} />,
      'Type.Object({\n  max_retries: Type.Integer({\n    minimum: 0,\n    maximum: 10\n  }),\n})'
    );
  });

  it('uses wire name for optional property', async () => {
    const runner = await createTestRunner();
    const { User } = (await runner.compile(`
      @test model User {
        @encodedName("application/json", "is_active")
        isActive?: boolean;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={User} />,
      'Type.Object({\n  is_active: Type.Optional(Type.Boolean()),\n})'
    );
  });
});
