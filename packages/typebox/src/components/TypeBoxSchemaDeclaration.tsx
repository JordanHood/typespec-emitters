import * as ay from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';
import { refkeySym } from '../utils.jsx';
import { TypeBoxSchema, TypeBoxSchemaProps } from './TypeBoxSchema.jsx';

interface TypeBoxSchemaDeclarationProps
  extends Omit<ts.VarDeclarationProps, 'type' | 'name' | 'value' | 'kind'>, TypeBoxSchemaProps {
  readonly name?: string;
}

export function TypeBoxSchemaDeclaration(props: TypeBoxSchemaDeclarationProps) {
  const internalRk = ay.refkey(props.type, refkeySym);
  const [schemaProps, varDeclProps] = ay.splitProps(props, ['type', 'nested']) as [
    TypeBoxSchemaDeclarationProps,
    ts.VarDeclarationProps,
  ];

  const refkeys = [props.refkey ?? []].flat();
  refkeys.push(internalRk);
  const newProps = ay.mergeProps(varDeclProps, {
    refkey: refkeys,
    name:
      props.name ||
      ('name' in props.type && typeof props.type.name === 'string' && props.type.name) ||
      props.type.kind,
  });

  return (
    <ts.VarDeclaration {...newProps}>
      <TypeBoxSchema {...schemaProps} />
    </ts.VarDeclaration>
  );
}
