# @typespec-dev/emitter-typebox

## 0.3.0

### Minor Changes

- [#7](https://github.com/JordanHood/typespec-emitters/pull/7) [`b5b0648`](https://github.com/JordanHood/typespec-emitters/commit/b5b06488a68bbb323e7a557083ce81b5d6cbdd9d) Thanks [@JordanHood](https://github.com/JordanHood)! - Add validation constraints, descriptions, defaults, and intrinsic numeric bounds to generated TypeBox schemas.
  - String constraints: minLength, maxLength, pattern, format via decorators
  - Numeric constraints: minimum, maximum, exclusiveMinimum, exclusiveMaximum
  - Intrinsic bounds for int8/16/32, uint8/16/32, safeint, float32
  - Array constraints: minItems, maxItems
  - Description from @doc decorator
  - Default values from property defaults
  - Fix Type.Date() to Type.String({ format: "date" | "date-time" })

## 0.2.0

### Minor Changes

- [#5](https://github.com/JordanHood/typespec-emitters/pull/5) [`3646cbc`](https://github.com/JordanHood/typespec-emitters/commit/3646cbc62813c7d633eb28ad6eaba8a2b6beecf5) Thanks [@JordanHood](https://github.com/JordanHood)! - Add models, enums, unions, arrays, records, nullable, optionality, and tuple type support with Static type inference exports

## 0.1.0

### Minor Changes

- [`7ef94c7`](https://github.com/JordanHood/typespec-emitters/commit/7ef94c7e3542096658906ccdafa390af83d2aa07) Thanks [@JordanHood](https://github.com/JordanHood)! - Add typespec-typebox emitter with support for scalar, literal, and intrinsic types
