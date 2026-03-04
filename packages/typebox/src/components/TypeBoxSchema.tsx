import { Children, refkey, useContext } from '@alloy-js/core';
import { MemberExpression } from '@alloy-js/typescript';
import { Type } from '@typespec/compiler';
import { useTsp } from '@typespec/emitter-framework';
import { RecursiveModelContext, typeboxBaseSchemaParts } from '../typeboxBaseSchema.jsx';
import { refkeySym, shouldReference } from '../utils.jsx';

export interface TypeBoxSchemaProps {
  readonly type: Type;
  readonly nested?: boolean;
}

export function TypeBoxSchema(props: TypeBoxSchemaProps): Children {
  const { $ } = useTsp();
  const recursiveModel = useContext(RecursiveModelContext);

  const member = $.modelProperty.is(props.type) ? props.type : undefined;
  const type = member ? member.type : props.type;

  if (!props.nested) {
    return typeboxBaseSchemaParts(type, member);
  }

  if (shouldReference($.program, type)) {
    if (recursiveModel && type === recursiveModel) {
      return 'This';
    }
    return (
      <MemberExpression>
        <MemberExpression.Part refkey={refkey(type, refkeySym)} />
      </MemberExpression>
    );
  }

  return typeboxBaseSchemaParts(type, member);
}
