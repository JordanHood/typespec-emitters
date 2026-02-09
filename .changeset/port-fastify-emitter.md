---
"@typespec-dev/emitter-fastify": minor
---

Port fastify emitter to monorepo and refactor to zod-first type generation.

- Port emitter from standalone repo to monorepo with turborepo and pnpm workspaces
- Zod schemas are now the single source of truth for types, derived via `z.infer<>`
- Routes auto-import named schemas from models via refkey
- Remove separate schemas directory, consolidate into models
- Inline zod schemas for anonymous types in route validation
- Fix query/path param naming to use raw TypeSpec names for request access
- Bump typespec-zod to 0.0.0-68
