import { For } from '@alloy-js/core';
import { useTsp } from '@typespec/emitter-framework';
import { TypeDeclaration } from '@typespec/emitter-framework/typescript';
import type { Enum, Model, Scalar, Type, Union } from '@typespec/compiler';

export interface TsTypesProps {
  types: Type[];
}

type DeclarationType = Model | Enum | Union | Scalar;

/**
 * Generates TypeScript type declarations for a collection of TypeSpec types.
 * Uses the emitter-framework's TypeDeclaration component which automatically
 * routes to the appropriate declaration type (Interface, Union, Enum, etc.)
 */
export function TsTypes(props: TsTypesProps) {
  const { $ } = useTsp();

  const declarationTypes = props.types.filter(isDeclarationType);

  return (
    <For each={declarationTypes} doubleHardline>
      {function renderTypeDeclaration(type) {
        const name = $.type.getPlausibleName(type);
        return <TypeDeclaration export type={type} name={name} />;
      }}
    </For>
  );
}

function isDeclarationType(type: Type): type is DeclarationType {
  return (
    type.kind === 'Model' || type.kind === 'Enum' || type.kind === 'Union' || type.kind === 'Scalar'
  );
}
