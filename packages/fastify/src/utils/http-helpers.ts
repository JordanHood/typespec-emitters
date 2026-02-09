import type { Program } from '@typespec/compiler';
import { listServices } from '@typespec/compiler';
import { getHttpService, type HttpOperation } from '@typespec/http';

export interface ServiceInfo {
  operations: HttpOperation[];
  namespace: string;
}

/**
 * Gets all HTTP operations from the TypeSpec program
 */
export function getHttpOperations(program: Program): ServiceInfo | undefined {
  const services = listServices(program);

  if (services.length === 0) {
    return undefined;
  }

  const [service] = services;

  const [httpService, diagnostics] = getHttpService(program, service.type);

  const hasErrors = diagnostics.some(function checkError(d) {
    return d.severity === 'error';
  });

  if (hasErrors) {
    return undefined;
  }

  return {
    operations: httpService.operations,
    namespace: service.type.name,
  };
}

/**
 * Groups operations by their container (namespace or interface)
 */
export function groupOperationsByContainer(
  operations: HttpOperation[]
): Map<string, HttpOperation[]> {
  const grouped = new Map<string, HttpOperation[]>();

  for (const operation of operations) {
    const op = operation.operation;
    const container = op.interface ?? op.namespace;

    if (!container) continue;

    const containerName = container.name;

    if (!grouped.has(containerName)) {
      grouped.set(containerName, []);
    }

    grouped.get(containerName)!.push(operation);
  }

  return grouped;
}

/**
 * Gets the HTTP verb for an operation
 */
export function getHttpVerb(operation: HttpOperation): string {
  return operation.verb.toLowerCase();
}

/**
 * Gets the path for an operation
 */
export function getOperationPath(operation: HttpOperation): string {
  return operation.path;
}
