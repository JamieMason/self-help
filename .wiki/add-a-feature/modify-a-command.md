# Modify an existing command

## Read First

- [How it works](../get-started/core-concepts.md)
- [How to contribute](../get-started/contribution-guidelines.md)
- [Codebase map](../get-started/codebase-map.md)

**Find the command file in `src/`, edit the `run()` function, update tests.**

## Locating command files

| Command       | File                 |
| ------------- | -------------------- |
| `interactive` | `src/interactive.ts` |
| `markdown`    | `src/markdown.ts`    |
| `lint`        | `src/lint.ts`        |

Entry point: `src/bin.ts` (registers all commands)

## Command anatomy

Each command exports a `run()` function:

```typescript
export const run = async ({ sourcePath }: { sourcePath: string }) => {
  // 1. Resolve path and detect source type
  const dataPath = resolve(process.cwd(), sourcePath);

  // 2. Load tree (markdown folder or JS module)
  let tree: Node;
  if (isMarkdownSource(dataPath)) {
    tree = createMarkdownSource(dataPath);
  } else {
    // JS module loading...
  }

  // 3. Process tree (command-specific logic)
  // ...
};
```

## Common modifications

### Add a new option

1. Update the command registration in `src/bin.ts`:

```typescript
prog
  .command('existing-command')
  .option('-n, --new-option', 'Description', 'default')
  .action((opts) => run(opts));
```

2. Update the `run()` function signature and implementation

3. Add tests for the new option

### Change output format

Edit the processing logic in the command's `run()` function. For markdown output, see
`src/lib/markdown.ts`.

### Add validation

Use `tryPanic()` or `tryPanicAsync()` from `src/lib/try-panic.ts` for operations that should exit on
failure.

## Testing commands

Tests live in sibling `.spec.ts` files:

- `src/interactive.spec.ts` (if exists)
- `src/markdown.spec.ts` (if exists)
- `src/lint.spec.ts`

```typescript
import { describe, expect, it } from 'vitest';

describe('command-name', () => {
  it('should handle specific case', async () => {
    // Test implementation
  });
});
```

## Source files

- Command registration: `src/bin.ts`
- Interactive: `src/interactive.ts`
- Markdown: `src/markdown.ts`
- Lint: `src/lint.ts`
- Error handling: `src/lib/try-panic.ts`
- Markdown rendering: `src/lib/markdown.ts`

## Read Next

- [Test state machine transitions](../write-tests/state-machine-tests.md)
