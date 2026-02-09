import type { Model, Program, Type } from '@typespec/compiler';
import { navigateType } from '@typespec/compiler';
import type { HttpOperation } from '@typespec/http';

/**
 * Discovers all types referenced by HTTP operations that should be emitted
 * as TypeScript declarations.
 */
export function discoverTypesFromOperations(program: Program, operations: HttpOperation[]): Type[] {
  const discoveredTypes = new Set<Type>();

  for (const operation of operations) {
    const op = operation.operation;

    if (op.parameters.kind === 'Model') {
      collectTypesFromModel(op.parameters);
    }

    navigateType(
      op.returnType,
      {
        model: collectType,
        enum: collectType,
        union: collectType,
      },
      { includeTemplateDeclaration: false }
    );

    if (operation.parameters.body) {
      navigateType(
        operation.parameters.body.type,
        {
          model: collectType,
          enum: collectType,
          union: collectType,
        },
        { includeTemplateDeclaration: false }
      );
    }
  }

  return Array.from(discoveredTypes);

  function collectType(type: Type) {
    if (shouldReference(program, type) && hasName(type)) {
      discoveredTypes.add(type);
    }
  }

  function collectTypesFromModel(model: Model) {
    navigateType(
      model,
      {
        model: collectType,
        enum: collectType,
        union: collectType,
      },
      { includeTemplateDeclaration: false }
    );
  }
}

/**
 * Determines if a type should be referenced (emitted as a declaration)
 * rather than inlined.
 */
function shouldReference(program: Program, type: Type): boolean {
  if (!isDeclaration(type)) return false;
  if (isBuiltIn(program, type)) return false;
  return true;
}

/**
 * Checks if a type is a declaration (has a name and can be referenced)
 */
function isDeclaration(type: Type): boolean {
  return (
    (type.kind === 'Model' && 'name' in type && typeof type.name === 'string') ||
    (type.kind === 'Enum' && 'name' in type && typeof type.name === 'string') ||
    (type.kind === 'Union' && 'name' in type && typeof type.name === 'string') ||
    (type.kind === 'Scalar' && 'name' in type && typeof type.name === 'string')
  );
}

/**
 * Checks if a type has a name
 */
function hasName(type: Type): boolean {
  return 'name' in type && typeof type.name === 'string' && type.name.length > 0;
}

/**
 * Checks if a type is from the TypeSpec standard library
 */
function isBuiltIn(program: Program, type: Type): boolean {
  if (!('namespace' in type) || !type.namespace) return false;

  const globalNs = program.getGlobalNamespaceType();
  let current = type.namespace;

  while (current) {
    if (current === globalNs.namespaces.get('TypeSpec')) {
      return true;
    }
    if (!current.namespace) break;
    current = current.namespace;
  }

  return false;
}
