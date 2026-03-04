import { ContentOutputFile, render } from '@alloy-js/core';
import { createTSNamePolicy, SourceFile } from '@alloy-js/typescript';
import { Model } from '@typespec/compiler';
import { Output } from '@typespec/emitter-framework';
import { describe, expect, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { TypeBoxSchemaDeclaration } from '../src/components/TypeBoxSchemaDeclaration.jsx';
import { typebox } from '../src/index.js';
import { createTestRunner, expectRender } from './utils.jsx';

describe('recursive types', () => {
  it('wraps self-referencing model in Type.Recursive', async () => {
    const runner = await createTestRunner();
    const { TreeNode } = (await runner.compile(`
      @test model TreeNode {
        value: string;
        children: TreeNode[];
      }
    `)) as Record<string, Model>;

    const template = (
      <Output program={runner.program} namePolicy={createTSNamePolicy()} externals={[typebox]}>
        <SourceFile path="test.ts">
          <TypeBoxSchemaDeclaration type={TreeNode} export />
        </SourceFile>
      </Output>
    );

    const output = render(template, { insertFinalNewLine: false });
    const contents = (output.contents[0] as ContentOutputFile).contents;
    expect(contents).toContain('Type.Recursive(This =>');
    expect(contents).toContain('Type.Array(This)');
    expect(contents).toContain('value: Type.String()');
  });

  it('handles optional self-reference', async () => {
    const runner = await createTestRunner();
    const { LinkedNode } = (await runner.compile(`
      @test model LinkedNode {
        value: string;
        next?: LinkedNode;
      }
    `)) as Record<string, Model>;

    const template = (
      <Output program={runner.program} namePolicy={createTSNamePolicy()} externals={[typebox]}>
        <SourceFile path="test.ts">
          <TypeBoxSchemaDeclaration type={LinkedNode} export />
        </SourceFile>
      </Output>
    );

    const output = render(template, { insertFinalNewLine: false });
    const contents = (output.contents[0] as ContentOutputFile).contents;
    expect(contents).toContain('Type.Recursive(This =>');
    expect(contents).toContain('Type.Optional(This)');
  });

  it('does not wrap non-recursive model', async () => {
    const runner = await createTestRunner();
    const { Simple } = (await runner.compile(`
      @test model Simple {
        name: string;
        age: int32;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Simple} />,
      'Type.Object({\n  name: Type.String(),\n  age: Type.Integer({\n    minimum: -2147483648,\n    maximum: 2147483647\n  }),\n})'
    );
  });

  it('handles self-referencing through Record', async () => {
    const runner = await createTestRunner();
    const { JsonValue } = (await runner.compile(`
      @test model JsonValue {
        nested: Record<JsonValue>;
      }
    `)) as Record<string, Model>;

    const template = (
      <Output program={runner.program} namePolicy={createTSNamePolicy()} externals={[typebox]}>
        <SourceFile path="test.ts">
          <TypeBoxSchemaDeclaration type={JsonValue} export />
        </SourceFile>
      </Output>
    );

    const output = render(template, { insertFinalNewLine: false });
    const contents = (output.contents[0] as ContentOutputFile).contents;
    expect(contents).toContain('Type.Recursive(This =>');
    expect(contents).toContain('Type.Record(');
  });
});
