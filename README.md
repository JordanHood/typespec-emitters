# TypeSpec Emitters

Monorepo for TypeSpec emitters.

## Structure

- `packages/*` - TypeSpec emitter packages

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint

# Create a changeset
pnpm changeset
```

## Publishing

This repo uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

1. Create a changeset: `pnpm changeset`
2. Commit the changeset file
3. On merge to main, a PR will be created to version packages
4. Merge the version PR to publish to npm
