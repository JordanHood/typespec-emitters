import * as ay from '@alloy-js/core';
import * as ts from '@alloy-js/typescript';
import { useTSNamePolicy } from '@alloy-js/typescript';
import { typebox } from '../external-packages/typebox.js';
import { refkeySym } from '../utils.jsx';
import { TypeBoxSchema, TypeBoxSchemaProps } from './TypeBoxSchema.jsx';

interface TypeBoxSchemaDeclarationProps
  extends Omit<ts.VarDeclarationProps, 'type' | 'name' | 'value' | 'kind'>, TypeBoxSchemaProps {
  readonly name?: string;
}

const efRefkeyPrefix = Symbol.for('emitter-framework:typescript');

export function TypeBoxSchemaDeclaration(props: TypeBoxSchemaDeclarationProps) {
  const internalRk = ay.refkey(props.type, refkeySym);
  const [schemaProps, varDeclProps] = ay.splitProps(props, ['type', 'nested']) as [
    TypeBoxSchemaDeclarationProps,
    ts.VarDeclarationProps,
  ];

  const refkeys = [props.refkey ?? []].flat();
  refkeys.push(internalRk);

  const namePolicy = useTSNamePolicy();
  const rawName =
    props.name ||
    ('name' in props.type && typeof props.type.name === 'string' && props.type.name) ||
    props.type.kind;

  const schemaName = namePolicy.getName(rawName, 'variable');
  const typeName = namePolicy.getName(rawName, 'type');

  const newProps = ay.mergeProps(varDeclProps, {
    refkey: refkeys,
    name: schemaName,
  });

  return (
    <>
      <ts.VarDeclaration {...newProps}>
        <TypeBoxSchema {...schemaProps} />
      </ts.VarDeclaration>
      {'\n'}
      <ts.TypeDeclaration export name={typeName} refkey={ay.refkey(efRefkeyPrefix, props.type)}>
        {typebox.Static}
        {'<typeof '}
        {schemaName}
        {'>'}
      </ts.TypeDeclaration>
    </>
  );
}
