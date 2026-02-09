import { For, refkey } from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';
import type { Type } from '@typespec/compiler';
import { ZodSchemaDeclaration, zod } from 'typespec-zod';
import { useTsp } from '@typespec/emitter-framework';

export interface ZodSchemasAndInferredTypesProps {
  types: Type[];
}

type DeclarationType = Extract<Type, { kind: 'Model' | 'Enum' | 'Union' | 'Scalar' }>;

const efRefkeyPrefix = Symbol.for('emitter-framework:typescript');

function isDeclarationType(type: Type): type is DeclarationType {
  return (
    type.kind === 'Model' || type.kind === 'Enum' || type.kind === 'Union' || type.kind === 'Scalar'
  );
}

export function ZodSchemasAndInferredTypes(props: ZodSchemasAndInferredTypesProps) {
  const { $ } = useTsp();
  const declarationTypes = props.types.filter(isDeclarationType);

  return (
    <For each={declarationTypes} doubleHardline>
      {function (type) {
        const name = $.type.getPlausibleName(type);
        const schemaName = name.charAt(0).toLowerCase() + name.slice(1);

        return (
          <>
            <ZodSchemaDeclaration export const type={type} name={schemaName} />
            {'\n'}
            <ts.TypeDeclaration export name={name} refkey={refkey(efRefkeyPrefix, type)}>
              {zod.z}.infer{'<typeof '}
              {schemaName}
              {'>'}
            </ts.TypeDeclaration>
          </>
        );
      }}
    </For>
  );
}
