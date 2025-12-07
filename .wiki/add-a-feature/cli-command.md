# Add a CLI command

## Read First

- [How it works](../get-started/core-concepts.md)
- [How to contribute](../get-started/contribution-guidelines.md)
- [Codebase map](../get-started/codebase-map.md)

## Read Next

- [Test state machine transitions](../write-tests/state-machine-tests.md)

---

**Create a new command file, register it in bin.ts, add tests.**

## Steps

1. Create `src/your-command.ts` with command implementation
2. Register in `src/bin.ts` with Commander
3. Add tests in `src/your-command.spec.ts`

## File locations

- Commands: `src/*.ts` (e.g., `src/interactive.ts`, `src/markdown.ts`, `src/lint.ts`)
- Entry point: `src/bin.ts`
- Tests: sibling `.spec.ts` files

## Command structure

```typescript
// src/your-command.ts
import { resolve } from 'path';
import { pathToFileURL } from 'url';

import { createMarkdownSource, isMarkdownSource } from './source/index.js';
import { tryPanicAsync } from './lib/try-panic.js';

export const run = async ({ sourcePath }: { sourcePath: string }) => {
  const dataPath = resolve(process.cwd(), sourcePath);

  let tree: Node;
  if (isMarkdownSource(dataPath)) {
    tree = createMarkdownSource(dataPath);
  } else {
    const fileUrl = pathToFileURL(dataPath).href;
    const source = await tryPanicAsync(() => import(fileUrl), 'Failed to import source');
    tree = await tryPanicAsync(() => source.getHelpDocument(), 'Failed to get help document');
  }

  // Process tree...
};
```

## Registering in bin.ts

```typescript
prog
  .command('your-command')
  .describe('What it does')
  .option('-s, --source', 'Path to source', './docs')
  .action((opts: { source: string }) => {
    run({ sourcePath: opts.source });
  });
```

## Testing

```typescript
// src/your-command.spec.ts
import { describe, expect, it } from 'vitest';

describe('your-command', () => {
  it('should process the tree', async () => {
    // Test implementation
  });
});
```
