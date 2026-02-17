import * as ay from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';
import { EmitContext, ListenerFlow, navigateProgram, Program } from '@typespec/compiler';
import { $ } from '@typespec/compiler/typekit';
import { Output, writeOutput } from '@typespec/emitter-framework';
import { TypeBoxSchemaDeclaration } from './components/TypeBoxSchemaDeclaration.jsx';
import { typebox } from './external-packages/typebox.js';
import { newTopologicalTypeCollector } from './utils.jsx';

export async function $onEmit(context: EmitContext) {
  const types = getAllDataTypes(context.program);
  const tsNamePolicy = ts.createTSNamePolicy();

  writeOutput(
    context.program,
    <Output program={context.program} namePolicy={tsNamePolicy} externals={[typebox]}>
      <ts.SourceFile path="models.ts">
        <ay.For
          each={types}
          joiner={
            <>
              <hbr />
              <hbr />
            </>
          }
        >
          {(type) => <TypeBoxSchemaDeclaration type={type} export />}
        </ay.For>
      </ts.SourceFile>
    </Output>,
    context.emitterOutputDir
  );
}

function getAllDataTypes(program: Program) {
  const collector = newTopologicalTypeCollector(program);
  const globalNs = program.getGlobalNamespaceType();

  navigateProgram(
    program,
    {
      namespace(n) {
        if (n !== globalNs && !$(program).type.isUserDefined(n)) {
          return ListenerFlow.NoRecursion;
        }
      },
      model: collector.collectType,
      enum: collector.collectType,
      union: collector.collectType,
      scalar: collector.collectType,
    },
    { includeTemplateDeclaration: false }
  );

  return collector.types;
}
