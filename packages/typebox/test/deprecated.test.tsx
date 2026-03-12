import { Model, ModelProperty } from '@typespec/compiler';
import { describe, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { createTestRunner, expectRender } from './utils.jsx';

describe('deprecated', () => {
  it('emits deprecated: true on a deprecated property', async () => {
    const runner = await createTestRunner();
    const { oldProp } = (await runner.compile(`
      model Test {
        #deprecated "use newProp instead"
        @test oldProp: string;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={oldProp} />,
      'Type.String({\n  deprecated: true,\n  description: "Deprecated: use newProp instead"\n})'
    );
  });

  it('prepends deprecation message to existing @doc description', async () => {
    const runner = await createTestRunner();
    const { oldProp } = (await runner.compile(`
      model Test {
        #deprecated "use newProp instead"
        @test @doc("The old property") oldProp: string;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={oldProp} />,
      'Type.String({\n  deprecated: true,\n  description: "Deprecated: use newProp instead. The old property"\n})'
    );
  });

  it('emits deprecated model without breaking model emission', async () => {
    const runner = await createTestRunner();
    const { OldModel } = (await runner.compile(`
      #deprecated "use NewModel instead"
      @test model OldModel {
        name: string;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={OldModel} />,
      'Type.Object(\n  {\n    name: Type.String(),\n  },\n  {\n    deprecated: true,\n    description: "Deprecated: use NewModel instead"\n  }\n)'
    );
  });

  it('emits deprecated with constraints combination', async () => {
    const runner = await createTestRunner();
    const { username } = (await runner.compile(`
      model Test {
        #deprecated "old"
        @test @minLength(1) @maxLength(50) username: string;
      }
    `)) as Record<string, ModelProperty>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={username} />,
      'Type.String({\n  minLength: 1,\n  maxLength: 50,\n  deprecated: true,\n  description: "Deprecated: old"\n})'
    );
  });
});
