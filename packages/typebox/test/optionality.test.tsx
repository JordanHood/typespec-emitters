import { Model } from '@typespec/compiler';
import { describe, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

describe('optionality', () => {
  it('wraps optional string with Type.Optional', async () => {
    const runner = await createTestRunner();
    const { OptModel } = (await runner.compile(`
      @test model OptModel {
        name?: string;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={OptModel} />,
      'Type.Object({\n  name: Type.Optional(Type.String()),\n})'
    );
  });

  it('wraps optional integer with Type.Optional', async () => {
    const runner = await createTestRunner();
    const { OptInt } = (await runner.compile(`
      @test model OptInt {
        count?: int32;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={OptInt} />,
      'Type.Object({\n  count: Type.Optional(Type.Integer()),\n})'
    );
  });

  it('does not wrap required properties', async () => {
    const runner = await createTestRunner();
    const { ReqModel } = (await runner.compile(`
      @test model ReqModel {
        name: string;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={ReqModel} />,
      'Type.Object({\n  name: Type.String(),\n})'
    );
  });

  it('handles mix of required and optional', async () => {
    const runner = await createTestRunner();
    const { MixedModel } = (await runner.compile(`
      @test model MixedModel {
        required: string;
        optional?: int32;
        alsoRequired: boolean;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={MixedModel} />,
      'Type.Object({\n  required: Type.String(),\n  optional: Type.Optional(Type.Integer()),\n  alsoRequired: Type.Boolean(),\n})'
    );
  });
});
