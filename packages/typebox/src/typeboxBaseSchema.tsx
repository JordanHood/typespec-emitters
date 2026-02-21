import { For, refkey } from '@alloy-js/core';
import { Children } from '@alloy-js/core/jsx-runtime';
import {
  ArrayExpression,
  MemberExpression,
  ObjectExpression,
  ObjectProperty,
} from '@alloy-js/typescript';
import {
  Enum,
  LiteralType,
  Model,
  ModelProperty,
  Scalar,
  Tuple,
  Type,
  Union,
} from '@typespec/compiler';
import { Typekit } from '@typespec/compiler/typekit';
import { useTsp } from '@typespec/emitter-framework';
import { TypeBoxSchema } from './components/TypeBoxSchema.jsx';
import { buildTypeboxOpts } from './typeboxConstraints.jsx';
import { isRecord, refkeySym, shouldReference, typeboxCall } from './utils.jsx';

export function typeboxBaseSchemaParts(type: Type, member?: ModelProperty): Children {
  const { $ } = useTsp();

  switch (type.kind) {
    case 'Intrinsic':
      return intrinsicBaseType(type);
    case 'String':
    case 'Number':
    case 'Boolean':
      return literalBaseType($, type);
    case 'Scalar':
      return scalarBaseType($, type, member);
    case 'Model':
      return modelBaseType($, type, member);
    case 'Union':
      return unionBaseType(type);
    case 'Enum':
      return enumBaseType(type);
    case 'Tuple':
      return tupleBaseType(type);
    case 'ModelProperty':
      return typeboxBaseSchemaParts(type.type, type);
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

function scalarBaseType($: Typekit, type: Scalar, member?: ModelProperty): Children {
  if (type.baseScalar && shouldReference($.program, type.baseScalar)) {
    return (
      <MemberExpression>
        <MemberExpression.Part refkey={refkey(type.baseScalar, refkeySym)} />
      </MemberExpression>
    );
  }

  if ($.scalar.extendsBoolean(type)) {
    const opts = buildTypeboxOpts($, type, { member });
    return typeboxCall('Boolean', ...(opts ? [opts] : []));
  } else if ($.scalar.extendsNumeric(type)) {
    const opts = buildTypeboxOpts($, type, { member });
    if ($.scalar.extendsInteger(type)) {
      if (
        $.scalar.extendsInt32(type) ||
        $.scalar.extendsUint32(type) ||
        $.scalar.extendsSafeint(type)
      ) {
        return typeboxCall('Integer', ...(opts ? [opts] : []));
      } else {
        return typeboxCall('BigInt');
      }
    } else {
      return typeboxCall('Number', ...(opts ? [opts] : []));
    }
  } else if ($.scalar.extendsString(type)) {
    if ($.scalar.extendsUrl(type)) {
      const opts = buildTypeboxOpts($, type, { member, format: 'uri' });
      return typeboxCall('String', ...(opts ? [opts] : []));
    }
    const opts = buildTypeboxOpts($, type, { member });
    return typeboxCall('String', ...(opts ? [opts] : []));
  } else if ($.scalar.extendsBytes(type)) {
    return typeboxCall('Any');
  } else if ($.scalar.extendsPlainDate(type)) {
    const opts = buildTypeboxOpts($, type, { member, format: 'date' });
    return typeboxCall('String', ...(opts ? [opts] : []));
  } else if ($.scalar.extendsPlainTime(type)) {
    const opts = buildTypeboxOpts($, type, { member, format: 'time' });
    return typeboxCall('String', ...(opts ? [opts] : []));
  } else if ($.scalar.extendsUtcDateTime(type)) {
    const encoding = $.scalar.getEncoding(type);
    if (encoding === undefined) {
      const opts = buildTypeboxOpts($, type, { member, format: 'date-time' });
      return typeboxCall('String', ...(opts ? [opts] : []));
    } else if (encoding.encoding === 'unixTimestamp') {
      return scalarBaseType($, encoding.type, member);
    } else if (encoding.encoding === 'rfc3339') {
      const opts = buildTypeboxOpts($, type, { member, format: 'date-time' });
      return typeboxCall('String', ...(opts ? [opts] : []));
    } else {
      return scalarBaseType($, encoding.type, member);
    }
  } else if ($.scalar.extendsOffsetDateTime(type)) {
    const encoding = $.scalar.getEncoding(type);
    if (encoding === undefined) {
      const opts = buildTypeboxOpts($, type, { member, format: 'date-time' });
      return typeboxCall('String', ...(opts ? [opts] : []));
    } else if (encoding.encoding === 'rfc3339') {
      const opts = buildTypeboxOpts($, type, { member, format: 'date-time' });
      return typeboxCall('String', ...(opts ? [opts] : []));
    } else {
      return scalarBaseType($, encoding.type, member);
    }
  } else if ($.scalar.extendsDuration(type)) {
    const encoding = $.scalar.getEncoding(type);
    if (encoding === undefined || encoding.encoding === 'ISO8601') {
      const opts = buildTypeboxOpts($, type, { member, format: 'duration' });
      return typeboxCall('String', ...(opts ? [opts] : []));
    } else {
      return scalarBaseType($, encoding.type, member);
    }
  } else {
    return typeboxCall('Any');
  }
}

function modelBaseType($: Typekit, type: Model, member?: ModelProperty): Children {
  if ($.array.is(type)) {
    const opts = buildTypeboxOpts($, type, { member });
    return typeboxCall(
      'Array',
      <TypeBoxSchema type={type.indexer!.value} nested />,
      ...(opts ? [opts] : [])
    );
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
    return typeboxCall(
      'Intersect',
      <ArrayExpression>
        {objectPart}
        {recordPart}
      </ArrayExpression>
    );
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

function unionBaseType(type: Union): Children {
  return typeboxCall(
    'Union',
    <ArrayExpression>
      <For each={type.variants.values()} comma line>
        {function (variant) {
          return <TypeBoxSchema type={variant.type} nested />;
        }}
      </For>
    </ArrayExpression>
  );
}

function tupleBaseType(type: Tuple): Children {
  return typeboxCall(
    'Tuple',
    <ArrayExpression>
      <For each={type.values} comma line>
        {function (item) {
          return <TypeBoxSchema type={item} nested />;
        }}
      </For>
    </ArrayExpression>
  );
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
