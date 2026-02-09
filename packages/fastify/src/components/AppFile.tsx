import { List } from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';
import { fastifyLib } from '../external-packages/fastify.js';

/**
 * Generates the app.ts file which creates and configures a Fastify instance.
 */
export function AppFile() {
  return (
    <ts.SourceFile path="app.ts">
      <ts.FunctionDeclaration name="createApp" export returnType={fastifyLib.FastifyInstance}>
        <List>
          <ts.VarDeclaration name="server">
            <ts.FunctionCallExpression
              target={fastifyLib.fastify}
              args={[<ts.ObjectExpression jsValue={{ logger: true }} />]}
            />
          </ts.VarDeclaration>
          <>return server;</>
        </List>
      </ts.FunctionDeclaration>
    </ts.SourceFile>
  );
}
