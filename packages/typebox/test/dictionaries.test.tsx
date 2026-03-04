import { Model, ModelProperty } from '@typespec/compiler';
import { describe, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

describe('dictionaries', () => {
  it('works with Record of string values', async () => {
    const runner = await createTestRunner();
    const { dictProp } = (await runner.compile(`
      model Test {
        @test dictProp: Record<string>;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={dictProp.type} />,
      'Type.Record(Type.String(), Type.String())'
    );
  });

  it('works with Record of integer values', async () => {
    const runner = await createTestRunner();
    const { intDict } = (await runner.compile(`
      model Test {
        @test intDict: Record<int32>;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={intDict.type} />,
      'Type.Record(\n  Type.String(),\n  Type.Integer({\n    minimum: -2147483648,\n    maximum: 2147483647\n  })\n)'
    );
  });

  it('works with model extending Record with additional properties', async () => {
    const runner = await createTestRunner();
    const { Config } = (await runner.compile(`
      @test model Config extends Record<string> {
        apiKey: string;
        baseUrl: string;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Config} />,
      'Type.Intersect([\n  Type.Object({\n    apiKey: Type.String(),\n    baseUrl: Type.String(),\n  }),\n  Type.Record(Type.String(), Type.String())\n])'
    );
  });

  it('works with record property in model', async () => {
    const runner = await createTestRunner();
    const { DictModel } = (await runner.compile(`
      @test model DictModel {
        tags: Record<string>;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={DictModel} />,
      'Type.Object({\n  tags: Type.Record(Type.String(), Type.String()),\n})'
    );
  });
});
