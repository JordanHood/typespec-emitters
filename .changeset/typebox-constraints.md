---
"@typespec-dev/emitter-typebox": minor
---

Add validation constraints, descriptions, defaults, and intrinsic numeric bounds to generated TypeBox schemas.

- String constraints: minLength, maxLength, pattern, format via decorators
- Numeric constraints: minimum, maximum, exclusiveMinimum, exclusiveMaximum
- Intrinsic bounds for int8/16/32, uint8/16/32, safeint, float32
- Array constraints: minItems, maxItems
- Description from @doc decorator
- Default values from property defaults
- Fix Type.Date() to Type.String({ format: "date" | "date-time" })
