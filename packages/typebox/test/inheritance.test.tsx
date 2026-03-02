import { ContentOutputFile, render } from '@alloy-js/core';
import { createTSNamePolicy, SourceFile } from '@alloy-js/typescript';
import { Model } from '@typespec/compiler';
import { Output } from '@typespec/emitter-framework';
import { describe, expect, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { TypeBoxSchemaDeclaration } from '../src/components/TypeBoxSchemaDeclaration.jsx';
import { typebox } from '../src/index.js';
import { createTestRunner, expectRender } from './utils.jsx';

describe('inheritance', () => {
  it('works with simple single inheritance', async () => {
    const runner = await createTestRunner();
    const { Animal, Dog } = (await runner.compile(`
      @test model Animal {
        name: string;
      }

      @test model Dog extends Animal {
        breed: string;
      }
    `)) as Record<string, Model>;

    const template = (
      <Output program={runner.program} namePolicy={createTSNamePolicy()} externals={[typebox]}>
        <SourceFile path="test.ts">
          <TypeBoxSchemaDeclaration type={Animal} export />
          {'\n'}
          <TypeBoxSchemaDeclaration type={Dog} export />
        </SourceFile>
      </Output>
    );

    const output = render(template, { insertFinalNewLine: false });
    const contents = (output.contents[0] as ContentOutputFile).contents;
    expect(contents).toContain('Type.Intersect([\n  animal,');
    expect(contents).toContain('breed: Type.String()');
  });

  it('model with no base still emits Type.Object', async () => {
    const runner = await createTestRunner();
    const { Standalone } = (await runner.compile(`
      @test model Standalone {
        value: string;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Standalone} />,
      'Type.Object({\n  value: Type.String(),\n})'
    );
  });

  it('works with multiple levels of inheritance', async () => {
    const runner = await createTestRunner();
    const { Base, Middle, Leaf } = (await runner.compile(`
      @test model Base {
        id: string;
      }

      @test model Middle extends Base {
        name: string;
      }

      @test model Leaf extends Middle {
        extra: string;
      }
    `)) as Record<string, Model>;

    const template = (
      <Output program={runner.program} namePolicy={createTSNamePolicy()} externals={[typebox]}>
        <SourceFile path="test.ts">
          <TypeBoxSchemaDeclaration type={Base} export />
          {'\n'}
          <TypeBoxSchemaDeclaration type={Middle} export />
          {'\n'}
          <TypeBoxSchemaDeclaration type={Leaf} export />
        </SourceFile>
      </Output>
    );

    const output = render(template, { insertFinalNewLine: false });
    const contents = (output.contents[0] as ContentOutputFile).contents;
    expect(contents).toContain('Type.Intersect([\n  base,');
    expect(contents).toContain('Type.Intersect([\n  middle,');
  });

  it('works with empty extension', async () => {
    const runner = await createTestRunner();
    const { Animal, EmptyDog } = (await runner.compile(`
      @test model Animal {
        name: string;
      }

      @test model EmptyDog extends Animal {}
    `)) as Record<string, Model>;

    const template = (
      <Output program={runner.program} namePolicy={createTSNamePolicy()} externals={[typebox]}>
        <SourceFile path="test.ts">
          <TypeBoxSchemaDeclaration type={Animal} export />
          {'\n'}
          <TypeBoxSchemaDeclaration type={EmptyDog} export />
        </SourceFile>
      </Output>
    );

    const output = render(template, { insertFinalNewLine: false });
    const contents = (output.contents[0] as ContentOutputFile).contents;
    expect(contents).toContain('Type.Intersect([animal, Type.Object({})]');
  });
});
