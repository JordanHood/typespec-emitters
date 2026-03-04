---
"@typespec-dev/emitter-typebox": minor
---

Add inheritance, discriminated unions, recursive types, tuples, and custom scalar support to generated TypeBox schemas.

- Model inheritance via Type.Intersect() for extends relationships
- Discriminated unions with Type.Union() and discriminator key detection
- Recursive/self-referencing models via Type.Recursive() and Type.Ref()
- Tuple types via Type.Tuple()
- Custom scalar types (e.g. uri, uuid) mapped to constrained Type.String()
- Anonymous model and spread property support
- Record types with additional properties via Type.Record()
