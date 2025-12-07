# Quick Reference: Common Code Patterns

<purpose>
This is a quick lookup guide for the most common patterns when working on Self-Help.
</purpose>

<node_types>

## Node Types

### Leaf (Terminal Node)

```typescript
interface Leaf {
  label: string; // Display text for the choice
  value: string; // Answer content (usually Markdown)
}

// Example
const leaf: Leaf = {
  label: 'I want to install dependencies',
  value: '# Installation\n\nRun `npm install` to install dependencies.',
};
```

### Branch (Sync Children)

```typescript
interface Branch {
  label: string; // Question/prompt text
  children: Node[]; // Available choices
}

// Example
const branch: Branch = {
  label: 'What do you want to do?',
  children: [leaf1, leaf2, nestedBranch],
};
```

### AsyncBranch (Lazy-Loaded Children)

```typescript
interface AsyncBranch {
  label: string;
  children: () => Promise<Node[]>; // Function returning Promise
}

// Example
const asyncBranch: AsyncBranch = {
  label: 'Load more options',
  children: () => fetch('/api/options').then((r) => r.json()),
};
```

</node_types>

<type_guards>

## Type Guards

```typescript
import { isLeaf, isBranch, isAsyncBranch, isNode, isChildren } from './machine/tree/nodes.js';

// Check node type
if (isLeaf(node)) {
  // node.value is available
}

if (isBranch(node)) {
  // node.children is Node[]
}

if (isAsyncBranch(node)) {
  // node.children is () => Promise<Node[]>
}

// Validate any value is a valid node
if (isNode(value)) {
  // value is Leaf | Branch | AsyncBranch
}

// Validate children array
if (isChildren(arr)) {
  // arr is Node[] with at least one element
}
```

</type_guards>

<state_machine>

## State Machine

### States

```typescript
// State values (from actor.getSnapshot().value)
'visitNode'; // Initial, determines node type
'renderBranch'; // Displaying branch options
'renderLeaf'; // Displaying leaf, awaiting FINALISE
'renderValue'; // Final state, showing answer
{
  resolveBranch: 'loading';
} // Loading async children
{
  resolveBranch: 'success';
} // Async load succeeded
{
  resolveBranch: 'failure';
} // Async load failed
```

### Events

```typescript
// Navigate to child node
actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

// Return to root node
actor.send({ type: 'SELECT_ROOT' });

// Display leaf value and end
actor.send({ type: 'FINALISE' });

// Retry failed async load
actor.send({ type: 'RETRY' });
```

### Context

```typescript
interface TreeContext {
  currentNode: Node; // Node being displayed
  rootNode: Node; // Original root (for SELECT_ROOT)
  error: Error | null; // Error from async loading
}

// Access context
const ctx = actor.getSnapshot().context;
console.log(ctx.currentNode.label);
```

### Creating Actors

```typescript
import { createTreeInterpreter, createTreeMachine } from './machine/tree/index.js';
import { createActor } from 'xstate';

// Simple creation
const actor = createTreeInterpreter(rootNode);
actor.start();

// With custom ID
const actor = createTreeInterpreter(rootNode, 'my-custom-id');

// Manual creation
const machine = createTreeMachine(rootNode, 'my-id');
const actor = createActor(machine);
actor.start();
```

### Subscribing to Changes

```typescript
actor.subscribe((snapshot) => {
  const state = snapshot.value;
  const context = snapshot.context;

  if (snapshot.matches('renderBranch')) {
    // Show options
  } else if (snapshot.matches('renderLeaf')) {
    // Show leaf
  } else if (snapshot.matches({ resolveBranch: 'loading' })) {
    // Show loading indicator
  }
});
```

</state_machine>

<test_patterns>

## Test Patterns

### Factory Functions

```typescript
const createLeaf = (label: string, value: string): Leaf => ({
  label,
  value,
});

const createBranch = (label: string, children: Node[]): Branch => ({
  label,
  children,
});

const createAsyncBranch = (label: string, children: Node[]): AsyncBranch => ({
  label,
  children: () => Promise.resolve(children),
});
```

### Testing Sync Transitions

```typescript
it('should transition to renderLeaf when starting with a leaf', () => {
  const rootNode = createLeaf('Leaf Node', 'leaf value');
  const actor = createTreeInterpreter(rootNode);

  actor.start();

  expect(actor.getSnapshot().value).toBe('renderLeaf');
});

it('should navigate to child on SELECT_CHILD', () => {
  const child = createLeaf('Child', 'value');
  const rootNode = createBranch('Root', [child]);
  const actor = createTreeInterpreter(rootNode);

  actor.start();
  actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

  expect(actor.getSnapshot().value).toBe('renderLeaf');
  expect(actor.getSnapshot().context.currentNode).toBe(child);
});
```

### Testing Async Transitions

```typescript
import { waitFor } from 'xstate';

it('should resolve async branch', async () => {
  const child = createLeaf('Child', 'value');
  const rootNode = {
    label: 'Async Branch',
    children: () => Promise.resolve([child]),
  };
  const actor = createActor(createTreeMachine(rootNode));

  actor.start();

  await waitFor(actor, (state) => state.matches('renderBranch'), {
    timeout: 5000,
  });

  expect(actor.getSnapshot().value).toBe('renderBranch');
});

it('should handle async failure', async () => {
  const rootNode = {
    label: 'Failing Branch',
    children: () => Promise.reject(new Error('Failed')),
  };
  const actor = createActor(createTreeMachine(rootNode));

  actor.start();

  await waitFor(actor, (state) => state.matches({ resolveBranch: 'failure' }));

  expect(actor.getSnapshot().context.error).toBeDefined();
});
```

### Testing Context Updates

```typescript
it('should update currentNode on navigation', () => {
  const child = createLeaf('Child', 'child value');
  const rootNode = createBranch('Root', [child]);
  const actor = createTreeInterpreter(rootNode);

  actor.start();

  expect(actor.getSnapshot().context.currentNode).toBe(rootNode);

  actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

  expect(actor.getSnapshot().context.currentNode).toBe(child);
});
```

</test_patterns>

<utility_functions>

## Utility Functions

### Type Checking (`src/lib/utils.ts`)

```typescript
import { isString, isArray, isFunction, get } from './lib/utils.js';

isString('hello'); // true
isString(123); // false

isArray([1, 2, 3]); // true
isArray('string'); // false

isFunction(() => {}); // true
isFunction({}); // false

get(obj, 'nested.path'); // Access nested property
get(obj, 'missing', 'default'); // With default value
get(obj, ['nested', 'path']); // Array path
```

### Error Handling (`src/lib/try-panic.ts`)

```typescript
import { tryPanic, tryPanicAsync } from './lib/try-panic.js';

// Sync - exits process on error
const result = tryPanic(() => JSON.parse(str), 'Failed to parse JSON');

// Async - exits process on error
const data = await tryPanicAsync(() => import(path), 'Failed to import');
```

### Markdown Rendering (`src/lib/markdown.ts`)

```typescript
import { renderToCli, toMarkdownFile } from './lib/markdown.js';

// Render Markdown for terminal display
const output = renderToCli('# Hello\n\nWorld');

// Convert entire tree to Markdown document
const markdown = await toMarkdownFile(rootNode);
```

</utility_functions>

<cli_patterns>

## CLI Patterns

### Command Definition (sade)

```typescript
import sade from 'sade';

const prog = sade('self-help');

prog.version(version);

prog
  .command('mycommand')
  .describe('description of command')
  .option('-s, --source', 'path to source file')
  .option('-o, --output', 'output path', 'default-value')
  .action((opts: { source?: string; output: string }) => {
    // Implementation
  });

prog.parse(process.argv);
```

### Loading Help Documents

```typescript
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const dataPath = resolve(process.cwd(), sourcePath);
const fileUrl = pathToFileURL(dataPath).href;
const source = await import(fileUrl);
const tree = await source.getHelpDocument();
```

</cli_patterns>

<imports>

## Import Patterns

### External Dependencies

```typescript
// XState
import { type Actor, assign, createActor, createMachine, fromPromise, type Snapshot } from 'xstate';
import { waitFor } from 'xstate';

// CLI prompts
import { isCancel, select } from '@clack/prompts';

// Markdown
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';

// CLI framework
import sade from 'sade';

// Colours
import c from 'tinyrainbow';

// Testing
import { describe, expect, it } from 'vitest';
```

### Internal Imports

```typescript
// Types (always use .js extension for NodeNext)
import type { Branch, Leaf, Node } from './index.js';
import type { TreeActor, TreeContext } from './machine/tree/index.js';

// Functions
import { createTreeInterpreter, createTreeMachine } from './machine/tree/index.js';
import { isLeaf, isBranch, isAsyncBranch } from './machine/tree/nodes.js';
import { isString, isArray, get } from './lib/utils.js';
import { tryPanicAsync } from './lib/try-panic.js';
```

</imports>

<commands>

## Running Commands

### Development

```bash
# Build TypeScript
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run specific test file
pnpm test -- index.spec

# Format code
pnpm format
```

### Testing Locally

```bash
# Interactive mode with fixture
node dist/bin.js interactive --source ./src/fixtures/rxjs-operator-decision-tree.ts

# Markdown export
node dist/bin.js markdown --source ./path/to/doc.js

# Get help
node dist/bin.js --help
node dist/bin.js interactive --help
```

### Publishing

```bash
# Release (bumps version, generates changelog)
pnpm release
```

</commands>

<file_paths>

## Common File Paths

```
src/index.ts                          # Public types (Leaf, Branch, etc.)
src/bin.ts                            # Main CLI entry
src/interactive.ts                    # Interactive command
src/markdown.ts                       # Markdown command
src/machine/tree/index.ts             # State machine
src/machine/tree/nodes.ts             # Type guards
src/lib/utils.ts                      # Utility functions
src/fixtures/rxjs-operator-decision-tree.ts  # Example document
```

</file_paths>

<state_transitions>

## State Transition Diagram

```
                    ┌─────────────┐
                    │  visitNode  │ (initial)
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    [isAsyncBranch]   [isBranch]      [isLeaf]
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │resolveBranch│ │renderBranch │ │ renderLeaf  │
    │   loading   │ └──────┬──────┘ └──────┬──────┘
    └──────┬──────┘        │               │
           │               │          FINALISE
      ┌────┴────┐    SELECT_CHILD          │
      │         │          │               ▼
   success   failure       │        ┌─────────────┐
      │         │          │        │ renderValue │ (final)
      │      RETRY         │        └─────────────┘
      │         │          │
      └────┬────┘          │
           │               │
           └───────────────┤
                           │
                      visitNode
                      (restart)
```

</state_transitions>
