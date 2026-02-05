import { For, List, SourceDirectory, type Refkey } from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';
import type { HttpOperation } from '@typespec/http';
import { RouteRegistration, getRouteRegistrationRef } from './RouteRegistration.js';
import { fastifyLib } from '../external-packages/fastify.js';
import { getOperationInterfaceRef } from './OperationInterface.js';

export interface RoutesDirectoryProps {
  groupedOperations: Map<string, HttpOperation[]>;
  loadRoutesRef: Refkey;
}

/**
 * Generates the routes directory with individual route files and an index loader.
 */
export function RoutesDirectory(props: RoutesDirectoryProps) {
  const { groupedOperations, loadRoutesRef } = props;
  const containerNames = Array.from(groupedOperations.keys());

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
    <SourceDirectory path="routes">
      <For each={Array.from(groupedOperations.entries())}>
        {([containerName, operations]) => (
          <ts.SourceFile path={`${containerName.toLowerCase()}.routes.ts`}>
            <RouteRegistration containerName={containerName} operations={operations} />
          </ts.SourceFile>
        )}
      </For>

      <ts.SourceFile path="index.ts">
        <ts.FunctionDeclaration
          name="loadRoutes"
          export
          refkey={loadRoutesRef}
          async
          parameters={[
            { name: 'server', type: fastifyLib.FastifyInstance },
            { name: 'operations', type: operationsType },
          ]}
          returnType="void"
        >
          <List>
            <For each={containerNames}>
              {function (containerName) {
                const routeRegRef = getRouteRegistrationRef(containerName);
                const containerKey = containerName.toLowerCase();
                return (
                  <>
                    await{' '}
                    <ts.FunctionCallExpression
                      target={routeRegRef}
                      args={['server', `operations.${containerKey}`]}
                    />
                    ;
                  </>
                );
              }}
            </For>
          </List>
        </ts.FunctionDeclaration>
      </ts.SourceFile>
    </SourceDirectory>
  );
}
