import { ContentOutputFile, render } from '@alloy-js/core';
import { createTSNamePolicy, SourceFile } from '@alloy-js/typescript';
import { Model } from '@typespec/compiler';
import { Output } from '@typespec/emitter-framework';
import { describe, expect, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { TypeBoxSchemaDeclaration } from '../src/components/TypeBoxSchemaDeclaration.jsx';
import { typebox } from '../src/index.js';
import { createTestRunner, expectRender } from './utils.jsx';

describe('models', () => {
  it('works with empty model', async () => {
    const runner = await createTestRunner();
    const { EmptyModel } = (await runner.compile(`
      @test model EmptyModel {}
    `)) as Record<string, Model>;

    expectRender(runner.program, <TypeBoxSchema type={EmptyModel} />, 'Type.Object({})');
  });

  it('works with simple model', async () => {
    const runner = await createTestRunner();
    const { SimpleModel } = (await runner.compile(`
      @test model SimpleModel {
        name: string;
        age: int32;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={SimpleModel} />,
      'Type.Object({\n  name: Type.String(),\n  age: Type.Integer(),\n})'
    );
  });

  it('works with optional properties', async () => {
    const runner = await createTestRunner();
    const { OptModel } = (await runner.compile(`
      @test model OptModel {
        required: string;
        optional?: int32;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={OptModel} />,
      'Type.Object({\n  required: Type.String(),\n  optional: Type.Optional(Type.Integer()),\n})'
    );
  });

  it('works with nested model reference', async () => {
    const runner = await createTestRunner();
    const { Child, Parent } = (await runner.compile(`
      @test model Child {
        value: string;
      }

      @test model Parent {
        child: Child;
      }
    `)) as Record<string, Model>;

    const template = (
      <Output program={runner.program} namePolicy={createTSNamePolicy()} externals={[typebox]}>
        <SourceFile path="test.ts">
          <TypeBoxSchemaDeclaration type={Child} export />
          {'\n'}
          <TypeBoxSchemaDeclaration type={Parent} export />
        </SourceFile>
      </Output>
    );

    const output = render(template, { insertFinalNewLine: false });
    const contents = (output.contents[0] as ContentOutputFile).contents;
    expect(contents).toContain('child: child');
  });

  it('works with literal property types', async () => {
    const runner = await createTestRunner();
    const { LitModel } = (await runner.compile(`
      @test model LitModel {
        status: "active";
        count: 42;
        flag: true;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={LitModel} />,
      'Type.Object({\n  status: Type.Literal("active"),\n  count: Type.Literal(42),\n  flag: Type.Literal(true),\n})'
    );
  });
});
