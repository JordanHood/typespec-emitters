import { ContentOutputFile, render } from '@alloy-js/core';
import { createTSNamePolicy, SourceFile } from '@alloy-js/typescript';
import { Model } from '@typespec/compiler';
import { Output } from '@typespec/emitter-framework';
import { describe, expect, it } from 'vitest';
import { TypeBoxSchema } from '../src/components/TypeBoxSchema.jsx';
import { TypeBoxSchemaDeclaration } from '../src/components/TypeBoxSchemaDeclaration.jsx';
import { typebox } from '../src/index.js';
import { createTestRunner, expectRender } from './utils.jsx';

describe('discriminated unions', () => {
  it('emits base model as Type.Union of derived variants', async () => {
    const runner = await createTestRunner();
    const { Shape, Circle, Square } = (await runner.compile(`
      @discriminator("kind")
      @test model Shape {
        kind: string;
      }

      @test model Circle extends Shape {
        kind: "circle";
        radius: float64;
      }

      @test model Square extends Shape {
        kind: "square";
        side: float64;
      }
    `)) as Record<string, Model>;

    const template = (
      <Output program={runner.program} namePolicy={createTSNamePolicy()} externals={[typebox]}>
        <SourceFile path="test.ts">
          <TypeBoxSchemaDeclaration type={Circle} export />
          {'\n'}
          <TypeBoxSchemaDeclaration type={Square} export />
          {'\n'}
          <TypeBoxSchemaDeclaration type={Shape} export />
        </SourceFile>
      </Output>
    );

    const output = render(template, { insertFinalNewLine: false });
    const contents = (output.contents[0] as ContentOutputFile).contents;
    expect(contents).toContain('Type.Union([circle, square])');
  });

  it('flattens derived model properties instead of using Intersect', async () => {
    const runner = await createTestRunner();
    const { Circle } = (await runner.compile(`
      @discriminator("kind")
      model Shape {
        kind: string;
      }

      @test model Circle extends Shape {
        kind: "circle";
        radius: float64;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Circle} />,
      'Type.Object({\n  kind: Type.Literal("circle"),\n  radius: Type.Number(),\n})'
    );
  });

  it('flattens multi-level inheritance for discriminated types', async () => {
    const runner = await createTestRunner();
    const { Dog } = (await runner.compile(`
      @discriminator("type")
      model Animal {
        type: string;
        name: string;
      }

      @test model Dog extends Animal {
        type: "dog";
        breed: string;
      }
    `)) as Record<string, Model>;

    expectRender(
      runner.program,
      <TypeBoxSchema type={Dog} />,
      'Type.Object({\n  type: Type.Literal("dog"),\n  breed: Type.String(),\n  name: Type.String(),\n})'
    );
  });

  it('handles three discriminated variants', async () => {
    const runner = await createTestRunner();
    const { Vehicle } = (await runner.compile(`
      @discriminator("type")
      @test model Vehicle {
        type: string;
      }

      model Car extends Vehicle {
        type: "car";
        doors: int32;
      }

      model Bike extends Vehicle {
        type: "bike";
        gears: int32;
      }

      model Truck extends Vehicle {
        type: "truck";
        payload: float64;
      }
    `)) as Record<string, Model>;

    const template = (
      <Output program={runner.program} namePolicy={createTSNamePolicy()} externals={[typebox]}>
        <SourceFile path="test.ts">
          <TypeBoxSchemaDeclaration type={Vehicle} export />
        </SourceFile>
      </Output>
    );

    const output = render(template, { insertFinalNewLine: false });
    const contents = (output.contents[0] as ContentOutputFile).contents;
    expect(contents).toContain('Type.Union([');
  });
});
