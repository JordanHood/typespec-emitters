import { For } from '@alloy-js/core';
import { Children } from '@alloy-js/core/jsx-runtime';
import { ObjectExpression, ObjectProperty } from '@alloy-js/typescript';
import { getFormat, getPattern, ModelProperty, Scalar, Type } from '@typespec/compiler';
import { Typekit } from '@typespec/compiler/typekit';
import { ValueExpression } from '@typespec/emitter-framework/typescript';
import { isBuiltIn, shouldReference } from './utils.jsx';

interface BuildTypeboxOptsConfig {
  member?: ModelProperty;
  format?: string;
}

export function buildTypeboxOpts(
  $: Typekit,
  type: Type,
  config?: BuildTypeboxOptsConfig
): Children | undefined {
  const member = config?.member;
  const properties: Children[] = [];
  let hasFormat = false;

  if ($.scalar.is(type)) {
    if ($.scalar.extendsString(type)) {
      hasFormat = collectStringConstraints($, type, member, properties);
    } else if ($.scalar.extendsNumeric(type)) {
      collectNumericConstraints($, type, member, properties);
    }
  }

  if (!hasFormat && config?.format) {
    properties.push(<ObjectProperty name="format">{`"${config.format}"`}</ObjectProperty>);
  }

  if (type.kind === 'Model' && $.array.is(type)) {
    collectArrayConstraints($, type, member, properties);
  }

  collectDescription($, type, member, properties);
  collectDefault(member, properties);

  if (properties.length === 0) {
    return undefined;
  }

  return (
    <ObjectExpression>
      <For each={properties} comma hardline>
        {function (prop) {
          return prop;
        }}
      </For>
    </ObjectExpression>
  );
}

function getDecoratorSources($: Typekit, type: Type, member?: ModelProperty): Type[] {
  if (!$.scalar.is(type)) {
    return [...(member ? [member] : []), type];
  }

  const sources: Type[] = [...(member ? [member] : []), type];
  let current: Scalar | undefined = type.baseScalar;

  while (current && !shouldReference($.program, current)) {
    sources.push(current);
    current = current.baseScalar;
  }

  return sources;
}

function maxNumeric(a: number | undefined, b: number | undefined): number | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return Math.max(a, b);
}

function minNumeric(a: number | undefined, b: number | undefined): number | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return Math.min(a, b);
}

function collectStringConstraints(
  $: Typekit,
  type: Scalar,
  member: ModelProperty | undefined,
  properties: Children[]
): boolean {
  const sources = getDecoratorSources($, type, member);

  let minLength: number | undefined;
  let maxLength: number | undefined;
  let pattern: string | undefined;
  let format: string | undefined;

  for (const source of sources.reverse()) {
    const srcMinLength = $.type.minLength(source);
    const srcMaxLength = $.type.maxLength(source);
    const srcPattern = getPattern($.program, source);
    const srcFormat = getFormat($.program, source);

    minLength = maxNumeric(minLength, srcMinLength);
    maxLength = minNumeric(maxLength, srcMaxLength);
    pattern = pattern ?? srcPattern;
    format = format ?? srcFormat;
  }

  if (minLength !== undefined) {
    properties.push(<ObjectProperty name="minLength">{`${minLength}`}</ObjectProperty>);
  }
  if (maxLength !== undefined) {
    properties.push(<ObjectProperty name="maxLength">{`${maxLength}`}</ObjectProperty>);
  }
  if (pattern !== undefined) {
    properties.push(<ObjectProperty name="pattern">{`"${pattern}"`}</ObjectProperty>);
  }
  if (format !== undefined) {
    properties.push(<ObjectProperty name="format">{`"${format}"`}</ObjectProperty>);
  }

  return format !== undefined;
}

interface NumericConstraints {
  min?: number;
  max?: number;
  minExclusive?: number;
  maxExclusive?: number;
}

function intrinsicNumericConstraints($: Typekit, type: Type): NumericConstraints {
  if (!$.scalar.is(type)) return {};

  const knownType = $.scalar.getStdBase(type);
  if (!knownType || !$.scalar.extendsNumeric(knownType)) return {};

  if ($.scalar.extendsInt8(knownType)) {
    return { min: -(1 << 7), max: (1 << 7) - 1 };
  } else if ($.scalar.extendsInt16(knownType)) {
    return { min: -(1 << 15), max: (1 << 15) - 1 };
  } else if ($.scalar.extendsInt32(knownType)) {
    return { min: Number(-(1n << 31n)), max: Number((1n << 31n) - 1n) };
  } else if ($.scalar.extendsUint8(knownType)) {
    return { min: 0, max: (1 << 8) - 1 };
  } else if ($.scalar.extendsUint16(knownType)) {
    return { min: 0, max: (1 << 16) - 1 };
  } else if ($.scalar.extendsUint32(knownType)) {
    return { min: 0, max: Number((1n << 32n) - 1n) };
  } else if ($.scalar.extendsSafeint(knownType)) {
    return { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER };
  } else if ($.scalar.extendsFloat32(knownType)) {
    return { min: -3.4028235e38, max: 3.4028235e38 };
  }

  return {};
}

function assignNumericConstraints(target: NumericConstraints, source: NumericConstraints): void {
  target.min = maxNumeric(target.min, source.min);
  target.max = minNumeric(target.max, source.max);
  target.minExclusive = maxNumeric(target.minExclusive, source.minExclusive);
  target.maxExclusive = minNumeric(target.maxExclusive, source.maxExclusive);
}

function collectNumericConstraints(
  $: Typekit,
  type: Scalar,
  member: ModelProperty | undefined,
  properties: Children[]
): void {
  const sources = getDecoratorSources($, type, member);
  const intrinsic = intrinsicNumericConstraints($, type);

  const decorator: NumericConstraints = {};
  for (const source of sources) {
    const srcConstraints: NumericConstraints = {
      min: $.type.minValue(source),
      max: $.type.maxValue(source),
      minExclusive: $.type.minValueExclusive(source),
      maxExclusive: $.type.maxValueExclusive(source),
    };
    assignNumericConstraints(decorator, srcConstraints);
  }

  if (decorator.min !== undefined && decorator.minExclusive !== undefined) {
    if (decorator.minExclusive > decorator.min) {
      delete decorator.min;
    } else {
      delete decorator.minExclusive;
    }
  }

  if (decorator.max !== undefined && decorator.maxExclusive !== undefined) {
    if (decorator.maxExclusive < decorator.max) {
      delete decorator.max;
    } else {
      delete decorator.maxExclusive;
    }
  }

  const final: NumericConstraints = {};

  if (intrinsic.min !== undefined) {
    if (decorator.min !== undefined) {
      if (intrinsic.min > decorator.min) {
        delete decorator.min;
      } else {
        delete intrinsic.min;
      }
    } else if (decorator.minExclusive !== undefined) {
      if (intrinsic.min > decorator.minExclusive) {
        delete decorator.minExclusive;
      } else {
        delete intrinsic.min;
      }
    }
  }

  if (intrinsic.max !== undefined) {
    if (decorator.max !== undefined) {
      if (intrinsic.max < decorator.max) {
        delete decorator.max;
      } else {
        delete intrinsic.max;
      }
    } else if (decorator.maxExclusive !== undefined) {
      if (intrinsic.max < decorator.maxExclusive) {
        delete decorator.maxExclusive;
      } else {
        delete intrinsic.max;
      }
    }
  }

  assignNumericConstraints(final, intrinsic);
  assignNumericConstraints(final, decorator);

  if (final.min !== undefined) {
    properties.push(<ObjectProperty name="minimum">{`${final.min}`}</ObjectProperty>);
  }
  if (final.max !== undefined) {
    properties.push(<ObjectProperty name="maximum">{`${final.max}`}</ObjectProperty>);
  }
  if (final.minExclusive !== undefined) {
    properties.push(
      <ObjectProperty name="exclusiveMinimum">{`${final.minExclusive}`}</ObjectProperty>
    );
  }
  if (final.maxExclusive !== undefined) {
    properties.push(
      <ObjectProperty name="exclusiveMaximum">{`${final.maxExclusive}`}</ObjectProperty>
    );
  }
}

function collectArrayConstraints(
  $: Typekit,
  type: Type,
  member: ModelProperty | undefined,
  properties: Children[]
): void {
  let minItems = $.type.minItems(type);
  let maxItems = $.type.maxItems(type);

  if (member) {
    minItems = maxNumeric(minItems, $.type.minItems(member));
    maxItems = minNumeric(maxItems, $.type.maxItems(member));
  }

  if (minItems !== undefined && minItems > 0) {
    properties.push(<ObjectProperty name="minItems">{`${minItems}`}</ObjectProperty>);
  }
  if (maxItems !== undefined && maxItems > 0) {
    properties.push(<ObjectProperty name="maxItems">{`${maxItems}`}</ObjectProperty>);
  }
}

function collectDescription(
  $: Typekit,
  type: Type,
  member: ModelProperty | undefined,
  properties: Children[]
): void {
  let description: string | undefined;

  if (member) {
    description = $.type.getDoc(member);
  }

  if (!description && !isBuiltIn($.program, type)) {
    description = $.type.getDoc(type);
  }

  if (description) {
    properties.push(<ObjectProperty name="description">{`"${description}"`}</ObjectProperty>);
  }
}

function collectDefault(member: ModelProperty | undefined, properties: Children[]): void {
  if (!member || !member.defaultValue) return;

  properties.push(
    <ObjectProperty name="default">
      <ValueExpression value={member.defaultValue} />
    </ObjectProperty>
  );
}
