import { refkey, SourceDirectory } from '@alloy-js/core';
import { createTSNamePolicy } from '@alloy-js/typescript';
import type { EmitContext } from '@typespec/compiler';
import { Output, writeOutput } from '@typespec/emitter-framework';
import { ModelsDirectory } from './components/ModelsDirectory.js';
import { OperationsDirectory } from './components/OperationsDirectory.js';
import { RouterFile } from './components/RouterFile.js';
import { RoutesDirectory } from './components/RoutesDirectory.js';
import { ZodSchemasDirectory } from './components/ZodSchemasDirectory.js';
import { fastifyLib } from './external-packages/fastify.js';
import { fastifyTypeProviderZod } from './external-packages/fastify-type-provider-zod.js';
import { zod } from 'typespec-zod';
import { EmitterOptions } from './lib.js';
import { getHttpOperations, groupOperationsByContainer } from './utils/http-helpers.js';
import { discoverTypesFromOperations } from './utils/type-discovery.js';

export async function $onEmit(context: EmitContext<EmitterOptions>) {
  const httpInfo = getHttpOperations(context.program);

  if (!httpInfo) {
    console.warn('No HTTP service found in program');
    return;
  }

  const groupedOperations = groupOperationsByContainer(httpInfo.operations);
  const allTypes = discoverTypesFromOperations(context.program, httpInfo.operations);
  const loadRoutesRef = refkey('loadRoutes', 'route-loader');

  await writeOutput(
    context.program,
    <Output
      program={context.program}
      externals={[fastifyLib, zod, fastifyTypeProviderZod]}
      namePolicy={createTSNamePolicy()}
    >
      <SourceDirectory path=".">
        <ModelsDirectory namespace={httpInfo.namespace} types={allTypes} />
        <ZodSchemasDirectory namespace={httpInfo.namespace} types={allTypes} />
        <OperationsDirectory groupedOperations={groupedOperations} />
        <RoutesDirectory groupedOperations={groupedOperations} loadRoutesRef={loadRoutesRef} />
        <RouterFile
          namespace={httpInfo.namespace}
          loadRoutesRef={loadRoutesRef}
          groupedOperations={groupedOperations}
        />
      </SourceDirectory>
    </Output>,
    context.emitterOutputDir
  );
}
