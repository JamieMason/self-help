# Set up locally

Build, test, and run self-help locally.

## Prerequisites

- Node.js (ES2022+)
- pnpm

## Commands

### Build

```bash
pnpm build
```

Compiles TypeScript to `dist/`.

### Test

```bash
pnpm test              # Run all tests
pnpm test -- --watch   # Watch mode
pnpm test -- index     # Run specific test file
```

### Format

```bash
pnpm format
```

### Run locally

```bash
# Interactive mode with markdown folder
node dist/bin.js interactive --source ./test-wiki

# Interactive mode with JS module
node dist/bin.js interactive --source ./src/fixtures/rxjs-operator-decision-tree.ts

# Export to markdown
node dist/bin.js markdown --source ./test-wiki

# Lint markdown source
node dist/bin.js lint --source ./test-wiki
```

### Help

```bash
node dist/bin.js --help
node dist/bin.js interactive --help
```

## Development workflow

1. Make changes
2. `pnpm build`
3. Test with `node dist/bin.js ...`
4. Run `pnpm test`
5. Format with `pnpm format`

## Test fixtures

- `test-wiki/` — Example markdown folder source
- `src/fixtures/rxjs-operator-decision-tree.ts` — Example JS module

## Read Next

- [How to contribute](./contribution-guidelines.md)
- [Codebase map](./codebase-map.md)
