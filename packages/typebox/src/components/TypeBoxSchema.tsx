import { Children, refkey } from '@alloy-js/core';
import { MemberExpression } from '@alloy-js/typescript';
import { Type } from '@typespec/compiler';
import { useTsp } from '@typespec/emitter-framework';
import { typeboxBaseSchemaParts } from '../typeboxBaseSchema.jsx';
import { refkeySym, shouldReference } from '../utils.jsx';

export interface TypeBoxSchemaProps {
  readonly type: Type;
  readonly nested?: boolean;
}

export function TypeBoxSchema(props: TypeBoxSchemaProps): Children {
  const { $ } = useTsp();

  if (!props.nested) {
    return typeboxBaseSchemaParts(props.type);
  }

  const type = $.modelProperty.is(props.type) ? props.type.type : props.type;

  if (shouldReference($.program, type)) {
    return (
      <MemberExpression>
        <MemberExpression.Part refkey={refkey(type, refkeySym)} />
      </MemberExpression>
    );
  }

  return typeboxBaseSchemaParts(type);
}
