import { For, refkey } from '@alloy-js/core';
import { Children } from '@alloy-js/core/jsx-runtime';
import {
  ArrayExpression,
  MemberExpression,
  ObjectExpression,
  ObjectProperty,
} from '@alloy-js/typescript';
import { Enum, LiteralType, Model, Scalar, Type } from '@typespec/compiler';
import { Typekit } from '@typespec/compiler/typekit';
import { useTsp } from '@typespec/emitter-framework';
import { TypeBoxSchema } from './components/TypeBoxSchema.jsx';
import { isRecord, refkeySym, shouldReference, typeboxCall } from './utils.jsx';

export function typeboxBaseSchemaParts(type: Type): Children {
  const { $ } = useTsp();

  switch (type.kind) {
    case 'Intrinsic':
      return intrinsicBaseType(type);
    case 'String':
    case 'Number':
    case 'Boolean':
      return literalBaseType($, type);
    case 'Scalar':
      return scalarBaseType($, type);
    case 'Model':
      return modelBaseType($, type);
    case 'Enum':
      return enumBaseType(type);
    case 'ModelProperty':
      return typeboxBaseSchemaParts(type.type);
    case 'EnumMember':
      return type.value
        ? literalBaseType($, $.literal.create(type.value))
        : literalBaseType($, $.literal.create(type.name));
    default:
      return typeboxCall('Any');
  }
}

function literalBaseType($: Typekit, type: LiteralType): Children {
  switch (type.kind) {
    case 'String':
      return typeboxCall('Literal', `"${type.value}"`);
    case 'Number':
    case 'Boolean':
      return typeboxCall('Literal', `${type.value}`);
  }
}

function formatOpts(format: string): Children {
  return (
    <ObjectExpression>
      <ObjectProperty name="format">{`"${format}"`}</ObjectProperty>
    </ObjectExpression>
  );
}

function scalarBaseType($: Typekit, type: Scalar): Children {
  if (type.baseScalar && shouldReference($.program, type.baseScalar)) {
    return (
      <MemberExpression>
        <MemberExpression.Part refkey={refkey(type.baseScalar, refkeySym)} />
      </MemberExpression>
    );
  }

  if ($.scalar.extendsBoolean(type)) {
    return typeboxCall('Boolean');
  } else if ($.scalar.extendsNumeric(type)) {
    if ($.scalar.extendsInteger(type)) {
      if (
        $.scalar.extendsInt32(type) ||
        $.scalar.extendsUint32(type) ||
        $.scalar.extendsSafeint(type)
      ) {
        return typeboxCall('Integer');
      } else {
        return typeboxCall('BigInt');
      }
    } else {
      return typeboxCall('Number');
    }
  } else if ($.scalar.extendsString(type)) {
    if ($.scalar.extendsUrl(type)) {
      return typeboxCall('String', formatOpts('uri'));
    }
    return typeboxCall('String');
  } else if ($.scalar.extendsBytes(type)) {
    return typeboxCall('Any');
  } else if ($.scalar.extendsPlainDate(type)) {
    return typeboxCall('Date');
  } else if ($.scalar.extendsPlainTime(type)) {
    return typeboxCall('String', formatOpts('time'));
  } else if ($.scalar.extendsUtcDateTime(type)) {
    const encoding = $.scalar.getEncoding(type);
    if (encoding === undefined) {
      return typeboxCall('Date');
    } else if (encoding.encoding === 'unixTimestamp') {
      return scalarBaseType($, encoding.type);
    } else if (encoding.encoding === 'rfc3339') {
      return typeboxCall('String', formatOpts('date-time'));
    } else {
      return scalarBaseType($, encoding.type);
    }
  } else if ($.scalar.extendsOffsetDateTime(type)) {
    const encoding = $.scalar.getEncoding(type);
    if (encoding === undefined) {
      return typeboxCall('Date');
    } else if (encoding.encoding === 'rfc3339') {
      return typeboxCall('String', formatOpts('date-time'));
    } else {
      return scalarBaseType($, encoding.type);
    }
  } else if ($.scalar.extendsDuration(type)) {
    const encoding = $.scalar.getEncoding(type);
    if (encoding === undefined || encoding.encoding === 'ISO8601') {
      return typeboxCall('String', formatOpts('duration'));
    } else {
      return scalarBaseType($, encoding.type);
    }
  } else {
    return typeboxCall('Any');
  }
}

function modelBaseType($: Typekit, type: Model): Children {
  if ($.array.is(type)) {
    return typeboxCall('Array', <TypeBoxSchema type={type.indexer!.value} nested />);
  }

  let recordPart;
  if (
    isRecord($.program, type) ||
    (!!type.baseModel &&
      isRecord($.program, type.baseModel) &&
      !shouldReference($.program, type.baseModel))
  ) {
    recordPart = typeboxCall(
      'Record',
      <TypeBoxSchema type={(type.indexer ?? type.baseModel!.indexer!).key} nested />,
      <TypeBoxSchema type={(type.indexer ?? type.baseModel!.indexer!).value} nested />
    );
  }

  let objectPart;
  if (type.properties.size > 0) {
    const members = (
      <ObjectExpression>
        <For each={type.properties.values()} comma hardline enderPunctuation>
          {function (prop) {
            const schema = <TypeBoxSchema type={prop} nested />;
            return (
              <ObjectProperty name={prop.name}>
                {prop.optional ? typeboxCall('Optional', schema) : schema}
              </ObjectProperty>
            );
          }}
        </For>
      </ObjectExpression>
    );
    objectPart = typeboxCall('Object', members);
  }

  if (!objectPart && !recordPart) {
    return typeboxCall('Object', <ObjectExpression />);
  }

  if (objectPart && recordPart) {
    return typeboxCall('Intersect', <ArrayExpression>{objectPart}{recordPart}</ArrayExpression>);
  }

  const parts = objectPart ?? recordPart!;

  if (type.baseModel && shouldReference($.program, type.baseModel)) {
    return typeboxCall(
      'Intersect',
      <ArrayExpression>
        <MemberExpression>
          <MemberExpression.Part refkey={refkey(type.baseModel, refkeySym)} />
        </MemberExpression>
        {parts}
      </ArrayExpression>
    );
  }

  return parts;
}

function enumBaseType(type: Enum): Children {
  return typeboxCall(
    'Union',
    <ArrayExpression>
      <For each={type.members.values()} comma line>
        {function (member) {
          const value = member.value ?? member.name;
          if (typeof value === 'string') {
            return typeboxCall('Literal', `"${value}"`);
          }
          return typeboxCall('Literal', `${value}`);
        }}
      </For>
    </ArrayExpression>
  );
}

function intrinsicBaseType(type: Type): Children {
  if (type.kind === 'Intrinsic') {
    switch (type.name) {
      case 'null':
        return typeboxCall('Null');
      case 'never':
        return typeboxCall('Never');
      case 'unknown':
        return typeboxCall('Unknown');
      case 'void':
        return typeboxCall('Void');
      default:
        return typeboxCall('Any');
    }
  }
  return typeboxCall('Any');
}
