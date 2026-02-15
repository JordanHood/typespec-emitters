# @typespec-dev/emitter-fastify

## 0.1.1

### Patch Changes

- [`792f8b3`](https://github.com/JordanHood/typespec-emitters/commit/792f8b3fc5d948595ed5aea2e9bc5642e5911e84) Thanks [@JordanHood](https://github.com/JordanHood)! - Clean up dependency classifications: move alloy-js from peer to regular deps

## 0.1.0

### Minor Changes

- [#1](https://github.com/JordanHood/typespec-emitters/pull/1) [`c4c6f28`](https://github.com/JordanHood/typespec-emitters/commit/c4c6f28522a00f9cc069b793db901ec587f32cc5) Thanks [@JordanHood](https://github.com/JordanHood)! - Port fastify emitter to monorepo and refactor to zod-first type generation.
  - Port emitter from standalone repo to monorepo with turborepo and pnpm workspaces
  - Zod schemas are now the single source of truth for types, derived via `z.infer<>`
  - Routes auto-import named schemas from models via refkey
  - Remove separate schemas directory, consolidate into models
  - Inline zod schemas for anonymous types in route validation
  - Fix query/path param naming to use raw TypeSpec names for request access
  - Bump typespec-zod to 0.0.0-68
