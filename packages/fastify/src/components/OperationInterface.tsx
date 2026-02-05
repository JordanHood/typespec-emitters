import { For, List, refkey, type Refkey, type Children, code } from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';
import { useTSNamePolicy } from '@alloy-js/typescript';
import type { HttpOperation } from '@typespec/http';
import { isVoidType } from '@typespec/compiler';
import { TypeExpression } from '@typespec/emitter-framework/typescript';
import { getNoContentResponseRef } from './ResponseTypes.js';
export interface OperationInterfaceProps {
  containerName: string;
  operations: HttpOperation[];
}

/**
 * Creates a refkey for an operation interface.
 * This allows other components to reference this interface and
 * Alloy will automatically generate the import.
 */
export function getOperationInterfaceRef(containerName: string): Refkey {
  return refkey(containerName, 'operation-interface');
}

/**
 * Generates a TypeScript interface for a group of HTTP operations.
 * Following the http-server-js pattern, this creates an interface with methods
 * for each operation that the user will implement.
 */
export function OperationInterface(props: OperationInterfaceProps) {
  const { containerName, operations } = props;
  const interfaceRef = getOperationInterfaceRef(containerName);
  const namePolicy = useTSNamePolicy();
  return (
    <ts.InterfaceDeclaration name={containerName} export refkey={interfaceRef}>
      <List>
        <For each={operations} hardline semicolon>
          {(operation) => {
            const opName = namePolicy.getName(operation.operation.name, 'function');
            const parameters: {
              name: string;
              type: Children;
              optional?: boolean;
            }[] = [];

            for (const param of operation.parameters.parameters) {
              if (param.type === 'path') {
                const paramName = namePolicy.getName(param.param.name, 'parameter');
                parameters.push({
                  name: paramName,
                  type: <TypeExpression type={param.param.type} />,
                  optional: param.param.optional,
                });
              }
            }

            if (operation.parameters.body) {
              const bodyParam = operation.parameters.body;
              parameters.push({
                name: 'body',
                type: <TypeExpression type={bodyParam.type} />,
                optional: bodyParam.property?.optional ?? false,
              });
            }

            for (const param of operation.parameters.parameters) {
              if (param.type === 'header') {
                const paramName = namePolicy.getName(param.param.name, 'parameter');
                parameters.push({
                  name: paramName,
                  type: <TypeExpression type={param.param.type} />,
                  optional: param.param.optional,
                });
              }
            }

            const queryParams = operation.parameters.parameters.filter((p) => p.type === 'query');

            if (queryParams.length > 0) {
              const allQueryParamsOptional = queryParams.every((p) => p.param.optional);
              const optionsType = (
                <ts.InterfaceExpression>
                  <For each={queryParams} semicolon hardline>
                    {(param) => {
                      const paramName = namePolicy.getName(param.param.name, 'interface-member');
                      return (
                        <ts.InterfaceMember name={paramName} optional={param.param.optional}>
                          <TypeExpression type={param.param.type} />
                        </ts.InterfaceMember>
                      );
                    }}
                  </For>
                </ts.InterfaceExpression>
              );
              parameters.push({
                name: 'options',
                type: optionsType,
                optional: allQueryParamsOptional,
              });
            }
            const isVoid = isVoidType(operation.operation.returnType);
            const is204Response = operation.responses.some(function (r) {
              return r.statusCodes === 204;
            });
            const shouldEmitVoid = isVoid || is204Response;
            const noContentRef = getNoContentResponseRef();

            let returnType: Children;
            if (shouldEmitVoid) {
              returnType = code`Promise<${noContentRef}>`;
            } else {
              const responseBody = operation.responses
                .find(function (r) {
                  return r.responses.some(function (rc) {
                    return rc.body != null;
                  });
                })
                ?.responses.find(function (rc) {
                  return rc.body != null;
                })?.body;

              if (responseBody) {
                returnType = code`Promise<ResponseWithBody<${(<TypeExpression type={responseBody.type} />)}>>`;
              } else {
                returnType = code`Promise<ResponseWithBody<${(<TypeExpression type={operation.operation.returnType} />)}>>`;
              }
            }

            return (
              <ts.InterfaceMethod name={opName} parameters={parameters} returnType={returnType} />
            );
          }}
        </For>
      </List>
    </ts.InterfaceDeclaration>
  );
}
