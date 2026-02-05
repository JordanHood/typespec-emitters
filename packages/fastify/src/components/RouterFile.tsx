import { code, type Refkey, For } from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';
import type { HttpOperation } from '@typespec/http';
import { fastifyLib } from '../external-packages/fastify.js';
import { fastifyTypeProviderZod } from '../external-packages/fastify-type-provider-zod.js';
import { getOperationInterfaceRef } from './OperationInterface.js';

export interface RouterFileProps {
  namespace: string;
  loadRoutesRef: Refkey;
  groupedOperations: Map<string, HttpOperation[]>;
}

/**
 * Generates the router.ts file which creates a router registration function.
 * This is the main entry point for users to register generated routes with their Fastify instance.
 */
export function RouterFile(props: RouterFileProps) {
  const containerNames = Array.from(props.groupedOperations.keys());

  const operationsType = (
    <ts.InterfaceExpression>
      <For each={containerNames} semicolon hardline>
        {(containerName) => {
          const interfaceRef = getOperationInterfaceRef(containerName);
          return (
            <ts.InterfaceMember name={containerName.toLowerCase()}>
              {interfaceRef}
            </ts.InterfaceMember>
          );
        }}
      </For>
    </ts.InterfaceExpression>
  );

  return (
    <ts.SourceFile path="router.ts">
      <ts.FunctionDeclaration
        name="registerRoutes"
        export
        async
        parameters={[
          { name: 'server', type: fastifyLib.FastifyInstance },
          { name: 'operations', type: operationsType },
        ]}
        returnType="void"
      >
        {code`server.setValidatorCompiler(${fastifyTypeProviderZod.validatorCompiler});`}
        {code`server.setSerializerCompiler(${fastifyTypeProviderZod.serializerCompiler});`}
        {code`await ${(
          <ts.FunctionCallExpression target={props.loadRoutesRef} args={['server', 'operations']} />
        )};`}
      </ts.FunctionDeclaration>
    </ts.SourceFile>
  );
}
