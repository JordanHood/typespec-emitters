# Type Mapping Reference

This document shows how each TypeSpec type maps to TypeBox output produced by `@typespec-dev/emitter-typebox`.

## Scalars

### string

```typespec
scalar myString extends string;
```

```typescript
Type.String()
```

### boolean

```typespec
scalar myBool extends boolean;
```

```typescript
Type.Boolean()
```

### int32, uint32, safeint

Sized integer types always include intrinsic bounds:

```typespec
scalar myInt extends int32;
```

```typescript
Type.Integer({ minimum: -2147483648, maximum: 2147483647 })
```

`uint32` emits `Type.Integer({ minimum: 0, maximum: 4294967295 })`, `safeint` uses `Number.MIN_SAFE_INTEGER` / `Number.MAX_SAFE_INTEGER`.

### int8, int16, uint8, uint16

Smaller integer types also emit `Type.Integer()` with their intrinsic bounds:

```typespec
scalar myByte extends uint8;
```

```typescript
Type.Integer({ minimum: 0, maximum: 255 })
```

### int64, uint64

Types wider than 32 bits emit `Type.BigInt()`:

```typespec
scalar myBig extends int64;
```

```typescript
Type.BigInt()
```

### float32, float64, decimal

```typespec
scalar myFloat extends float64;
```

```typescript
Type.Number()
```

`float32` includes intrinsic bounds: `Type.Number({ minimum: -3.4028235e+38, maximum: 3.4028235e+38 })`. `decimal` and `decimal128` also emit `Type.Number()`.

### url

```typespec
scalar myUrl extends url;
```

```typescript
Type.String({ format: "uri" })
```

### bytes

```typespec
scalar myBytes extends bytes;
```

```typescript
Type.Any()
```

### plainDate

```typespec
scalar myDate extends plainDate;
```

```typescript
Type.String({ format: "date" })
```

### plainTime

```typespec
scalar myTime extends plainTime;
```

```typescript
Type.String({ format: "time" })
```

### utcDateTime

```typespec
scalar myDateTime extends utcDateTime;
```

```typescript
Type.String({ format: "date-time" })
```

With `unixTimestamp` encoding the emitter follows the encoding's base type. For example, an `int32`-based unix timestamp produces `Type.Integer({ minimum: -2147483648, maximum: 2147483647 })`.

### offsetDateTime

```typespec
scalar myOffsetDateTime extends offsetDateTime;
```

```typescript
Type.String({ format: "date-time" })
```

Other encodings follow the encoding's base type.

### duration

```typespec
scalar myDuration extends duration;
```

```typescript
Type.String({ format: "duration" })
```

ISO8601 encoding (the default) produces the same output. Other encodings follow the encoding's base type.

## Models

### Object model

```typespec
model Foo {
  x: string;
  y: int32;
}
```

```typescript
Type.Object({
  x: Type.String(),
  y: Type.Integer({
    minimum: -2147483648,
    maximum: 2147483647,
  }),
})
```

### Optional properties

```typespec
model Foo {
  x?: string;
}
```

```typescript
Type.Object({
  x: Type.Optional(Type.String()),
})
```

### Empty model

```typespec
model Empty {}
```

```typescript
Type.Object({})
```

### Records

```typespec
model Foo {
  tags: Record<string>;
}
```

```typescript
Type.Record(Type.String(), Type.String())
```

## Enums

```typespec
enum Color {
  Red,
  Blue,
}
```

```typescript
Type.Union([Type.Literal("Red"), Type.Literal("Blue")])
```

Enum members with explicit values use those values:

```typespec
enum Status {
  Active: 1,
  Inactive: 0,
}
```

```typescript
Type.Union([Type.Literal(1), Type.Literal(0)])
```

## Unions

```typespec
union MyUnion {
  string,
  int32,
}
```

```typescript
Type.Union([
  Type.String(),
  Type.Integer({
    minimum: -2147483648,
    maximum: 2147483647,
  }),
])
```

## Arrays

```typespec
model Foo {
  tags: string[];
}
```

```typescript
Type.Array(Type.String())
```

## Nullable

Nullable types are expressed as unions that include `null`:

```typespec
model Foo {
  x: string | null;
}
```

```typescript
Type.Union([Type.String(), Type.Null()])
```

## Optional

Optional properties are wrapped with `Type.Optional`:

```typespec
model Foo {
  x?: string;
}
```

```typescript
Type.Optional(Type.String())
```

## Constraints

Constraints from TypeSpec decorators are passed as an options object to the TypeBox call.

### String constraints

```typespec
@minLength(1) @maxLength(100) scalar shortString extends string;
```

```typescript
Type.String({ minLength: 1, maxLength: 100 })
```

### Pattern

```typespec
@pattern("^[a-z]+$") scalar slug extends string;
```

```typescript
Type.String({ pattern: "^[a-z]+$" })
```

### Format

```typespec
@format("email") scalar email extends string;
```

```typescript
Type.String({ format: "email" })
```

### Numeric constraints

Decorator bounds are merged with intrinsic bounds, keeping the tighter constraint on each side:

```typespec
@minValue(0) @maxValue(100) scalar percentage extends int32;
```

```typescript
Type.Integer({ minimum: 0, maximum: 100 })
```

Here `int32` has intrinsic bounds of -2147483648 to 2147483647, but the decorator bounds of 0 to 100 are tighter, so only those are emitted.

### Exclusive bounds

```typespec
@minValueExclusive(0) @maxValueExclusive(100) scalar openRange extends float64;
```

```typescript
Type.Number({ exclusiveMinimum: 0, exclusiveMaximum: 100 })
```

### Array constraints

```typespec
model Foo {
  @minItems(1) @maxItems(10) tags: string[];
}
```

```typescript
Type.Array(Type.String(), { minItems: 1, maxItems: 10 })
```

### Description

```typespec
model Foo {
  @doc("A person's name") name: string;
}
```

```typescript
Type.String({ description: "A person's name" })
```

The `@doc` decorator on a property takes precedence over `@doc` on the type itself.

### Default values

```typespec
model Foo {
  name?: string = "anonymous";
}
```

```typescript
Type.Optional(Type.String({ default: "anonymous" }))
```

### Combined constraints

Multiple constraints are merged into a single options object:

```typespec
@minLength(1) @maxLength(255) @doc("User email") @format("email")
scalar userEmail extends string;
```

```typescript
Type.String({ minLength: 1, maxLength: 255, format: "email", description: "User email" })
```

## Type Inference

Every top-level declaration emits both a schema constant and a `Static` type alias:

```typespec
model Foo {
  x: string;
}
```

```typescript
export const foo = Type.Object({
  x: Type.String(),
});
export type Foo = Static<typeof foo>;
```

The schema variable uses camelCase naming and the type alias uses PascalCase, both derived from the TypeSpec declaration name via the TypeScript name policy.
