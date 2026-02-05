import { For, SourceDirectory } from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';
import type { Type } from '@typespec/compiler';
import { ZodSchemaDeclaration } from 'typespec-zod';

export interface ZodSchemasDirectoryProps {
  namespace: string;
  types: Type[];
}

/**
 * Generates Zod schemas for TypeSpec types using the typespec-zod library.
 */
export function ZodSchemasDirectory(props: ZodSchemasDirectoryProps) {
  const declarationTypes = props.types.filter(isDeclarationType);

  return (
    <SourceDirectory path="schemas">
      <ts.SourceFile path={`${props.namespace.toLowerCase()}.ts`}>
        <For each={declarationTypes} hardline>
          {function (type) {
            return <ZodSchemaDeclaration export const type={type} />;
          }}
        </For>
      </ts.SourceFile>
    </SourceDirectory>
  );
}

type DeclarationType = Extract<Type, { kind: 'Model' | 'Enum' | 'Union' | 'Scalar' }>;

function isDeclarationType(type: Type): type is DeclarationType {
  return (
    type.kind === 'Model' || type.kind === 'Enum' || type.kind === 'Union' || type.kind === 'Scalar'
  );
}
