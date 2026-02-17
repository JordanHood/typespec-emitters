import { Output as AlloyOutput, ContentOutputFile, render } from '@alloy-js/core';
import { Children } from '@alloy-js/core/jsx-runtime';
import { createTSNamePolicy, SourceFile } from '@alloy-js/typescript';
import { Program } from '@typespec/compiler';
import {
  createTestHost as coreCreateTestHost,
  createTestWrapper,
} from '@typespec/compiler/testing';
import { Output } from '@typespec/emitter-framework';
import { expect } from 'vitest';
import { typebox } from '../src/index.js';
import { TypeSpecTypeBoxTestLibrary } from '../src/testing/index.js';

export function expectRender(program: Program, children: Children, expected: string) {
  const template = (
    <Output program={program} namePolicy={createTSNamePolicy()} externals={[typebox]}>
      <SourceFile path="test.ts">{children}</SourceFile>
    </Output>
  );

  const output = render(template, { insertFinalNewLine: false });
  expect((output.contents[0] as ContentOutputFile).contents.split(/\n/).slice(2).join('\n')).toBe(
    expected
  );
}

export function expectRenderPure(children: Children, expected: string) {
  const template = (
    <AlloyOutput externals={[typebox]}>
      <SourceFile path="test.ts">{children}</SourceFile>
    </AlloyOutput>
  );

  const output = render(template, { insertFinalNewLine: false });
  expect((output.contents[0] as ContentOutputFile).contents.split(/\n/).slice(2).join('\n')).toBe(
    expected
  );
}

export async function createTestHost() {
  return coreCreateTestHost({
    libraries: [TypeSpecTypeBoxTestLibrary],
  });
}

export async function createTestRunner() {
  const host = await createTestHost();
  return createTestWrapper(host, {
    wrapper: (code) => `${code}`,
  });
}

export async function createEmitterTestRunner() {
  const host = await createTestHost();

  return createTestWrapper(host, {
    wrapper: (code) => `${code}`,
    compilerOptions: {
      emit: ['@typespec-dev/emitter-typebox'],
      options: {
        '@typespec-dev/emitter-typebox': {},
      },
    },
  });
}
