import { SourceDirectory } from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';
import type { Type } from '@typespec/compiler';
import { ZodSchemasAndInferredTypes } from './ZodSchemasAndInferredTypes.js';
import { ResponseTypes } from './ResponseTypes.js';

export interface ModelsDirectoryProps {
  namespace: string;
  types: Type[];
}

/**
 * Generates the models directory with TypeSpec type declarations.
 */
export function ModelsDirectory(props: ModelsDirectoryProps) {
  return (
    <SourceDirectory path="models">
      <ts.SourceFile path="response-types.ts">
        <ResponseTypes />
      </ts.SourceFile>
      <ts.SourceFile path={`${props.namespace.toLowerCase()}.ts`}>
        <ZodSchemasAndInferredTypes types={props.types} />
      </ts.SourceFile>
    </SourceDirectory>
  );
}
