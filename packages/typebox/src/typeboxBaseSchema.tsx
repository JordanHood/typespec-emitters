import { createContext, For, refkey } from '@alloy-js/core';
import { Children } from '@alloy-js/core/jsx-runtime';
import {
  ArrayExpression,
  MemberExpression,
  ObjectExpression,
  ObjectProperty,
} from '@alloy-js/typescript';
import {
  Enum,
  getDiscriminator,
  getDiscriminatedUnionFromInheritance,
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

export const RecursiveModelContext = createContext<Model>();

function isSelfReferencing($: Typekit, model: Model): boolean {
  const visited = new Set<Type>();

  function check(type: Type): boolean {
    if (visited.has(type)) return false;
    visited.add(type);

    if (type === model) return true;

    if (type.kind === 'Model') {
      if ($.array.is(type)) {
        return check(type.indexer!.value);
      }
      if (isRecord($.program, type)) {
        return check(type.indexer!.value);
      }
      return false;
    }

    if (type.kind === 'Union') {
      for (const variant of type.variants.values()) {
        if (check(variant.type)) return true;
      }
    }

    return false;
  }

  for (const prop of model.properties.values()) {
    if (check(prop.type)) return true;
  }

  return false;
}

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

function hasDiscriminatedAncestor($: Typekit, type: Model): boolean {
  let current = type.baseModel;
  while (current) {
    if (getDiscriminator($.program, current)) return true;
    current = current.baseModel;
  }
  return false;
}

function buildObjectFromProperties(properties: ModelProperty[]): Children {
  const members = (
    <ObjectExpression>
      <For each={properties} comma hardline enderPunctuation>
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
  return typeboxCall('Object', members);
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

  const discriminator = getDiscriminator($.program, type);
  if (discriminator) {
    const [discUnion] = getDiscriminatedUnionFromInheritance(type, discriminator);
    if (discUnion && discUnion.variants.size > 0) {
      const variants = [...discUnion.variants.values()];
      return typeboxCall(
        'Union',
        <ArrayExpression>
          <For each={variants} comma line>
            {function (variant) {
              return <TypeBoxSchema type={variant} nested />;
            }}
          </For>
        </ArrayExpression>
      );
    }
  }

  if (hasDiscriminatedAncestor($, type)) {
    const allProperties = $.model.getProperties(type, { includeExtended: true });
    if (allProperties.size > 0) {
      return buildObjectFromProperties([...allProperties.values()]);
    }
    return typeboxCall('Object', <ObjectExpression />);
  }

  const recursive = isSelfReferencing($, type);
  const schema = recursive ? (
    <RecursiveModelContext.Provider value={type}>
      {modelSchemaBody($, type)}
    </RecursiveModelContext.Provider>
  ) : (
    modelSchemaBody($, type)
  );

  if (recursive) {
    return typeboxCall(
      'Recursive',
      <>
        {'This => '}
        {schema}
      </>
    );
  }

  return schema;
}

function modelSchemaBody($: Typekit, type: Model): Children {
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
    objectPart = buildObjectFromProperties([...type.properties.values()]);
  }

  let ownSchema;
  if (objectPart && recordPart) {
    const parts = [objectPart, recordPart];
    ownSchema = typeboxCall(
      'Intersect',
      <ArrayExpression>
        <For each={parts} comma line>
          {function (part) {
            return part;
          }}
        </For>
      </ArrayExpression>
    );
  } else {
    ownSchema = objectPart ?? recordPart ?? typeboxCall('Object', <ObjectExpression />);
  }

  if (type.baseModel && shouldReference($.program, type.baseModel)) {
    const baseRef = (
      <MemberExpression>
        <MemberExpression.Part refkey={refkey(type.baseModel, refkeySym)} />
      </MemberExpression>
    );
    const intersectParts = [baseRef, ownSchema];
    return typeboxCall(
      'Intersect',
      <ArrayExpression>
        <For each={intersectParts} comma line>
          {function (part) {
            return part;
          }}
        </For>
      </ArrayExpression>
    );
  }

  return ownSchema;
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
