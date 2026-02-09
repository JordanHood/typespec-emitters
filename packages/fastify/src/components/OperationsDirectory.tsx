import { For, SourceDirectory } from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';
import type { HttpOperation } from '@typespec/http';
import { isVoidType } from '@typespec/compiler';
import { OperationInterface } from './OperationInterface.js';

export interface OperationsDirectoryProps {
  groupedOperations: Map<string, HttpOperation[]>;
}

/**
 * Generates the operations directory with operation interface files.
 */
export function OperationsDirectory(props: OperationsDirectoryProps) {
  return (
    <SourceDirectory path="operations">
      <For each={Array.from(props.groupedOperations.entries())}>
        {([containerName, operations]) => {
          const hasResponseWithBody = operations.some((op) => {
            const isVoid = isVoidType(op.operation.returnType);
            const is204 = op.responses.some((r) => r.statusCodes === 204);
            return !isVoid && !is204;
          });

          return (
            <ts.SourceFile path={`${containerName.toLowerCase()}.ts`}>
              {hasResponseWithBody && (
                <>
                  import type {'{'} ResponseWithBody {'}'} from "../models/response-types.js";
                  {'\n\n'}
                </>
              )}
              <OperationInterface containerName={containerName} operations={operations} />
            </ts.SourceFile>
          );
        }}
      </For>
    </SourceDirectory>
  );
}
