# @typespec-dev/emitter-typebox

A TypeSpec emitter that generates TypeBox schemas from TypeSpec type definitions.

## Install

```sh
pnpm add @typespec-dev/emitter-typebox
```

### Peer dependencies

- `@typespec/compiler@1.8.0`
- `@typespec/emitter-framework@0.15.0`

## Configuration

Add the emitter to your `tspconfig.yaml`:

```yaml
emit:
  - "@typespec-dev/emitter-typebox"
```

## Example

Given a TypeSpec definition:

```typespec
model User {
  name: string;
  age?: int32;
  tags: string[];
}
```

The emitter produces:

```typescript
import { type Static, Type } from "typebox";

export const user = Type.Object({
  name: Type.String(),
  age: Type.Optional(Type.Integer()),
  tags: Type.Array(Type.String()),
});
export type User = Static<typeof user>;
```

## Supported Types

- Scalars (string, boolean, integers, floats, decimals, bigint, url, bytes, dates, durations)
- Literal types (string, number, boolean)
- Intrinsic types (null, never, unknown, void)
- Models (`Type.Object` with optional properties, nested references)
- Enums (union of literals)
- Unions, Arrays, Records, Tuples
- Nullable, Optional wrappers
- Constraints (minLength, maxLength, minimum, maximum, pattern, format, minItems, maxItems)
- Descriptions (`@doc` annotation)
- Default values (`@default` annotation)

## Development

```sh
pnpm build        # build the emitter
pnpm test         # run tests
pnpm lint         # lint
pnpm type         # type-check
```
