# Create test factories

## Read First

- [How it works](../get-started/core-concepts.md)

**Use factory functions to create test nodes.** Keeps tests focused on behaviour, not construction.

## Standard factories

```typescript
import type { AsyncBranch, Branch, Leaf, Node } from './index.js';

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

## Usage in tests

```typescript
import { describe, expect, it } from 'vitest';

describe('navigation', () => {
  // Define factories at top of describe block
  const createLeaf = (label: string, value: string): Leaf => ({ label, value });
  const createBranch = (label: string, children: Node[]): Branch => ({ label, children });

  it('should navigate to child', () => {
    const child = createLeaf('Child', 'child value');
    const root = createBranch('Root', [child]);

    const actor = createTreeInterpreter(root);
    actor.start();
    actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

    expect(actor.getSnapshot().context.currentNode).toBe(child);
  });
});
```

## Creating complex structures

```typescript
// Nested branches
const leaf1 = createLeaf('Answer 1', 'First answer');
const leaf2 = createLeaf('Answer 2', 'Second answer');
const subBranch = createBranch('Sub-topic', [leaf1, leaf2]);
const root = createBranch('Main topic', [subBranch]);

// Async branch with children
const asyncRoot: AsyncBranch = {
  label: 'Async Root',
  children: () => Promise.resolve([createLeaf('Loaded', 'Dynamically loaded content')]),
};

// Failing async branch
const failingBranch: AsyncBranch = {
  label: 'Failing',
  children: () => Promise.reject(new Error('Load failed')),
};
```

## Why factories?

- **Consistency** — All tests create nodes the same way
- **Maintenance** — Changes to node structure only affect factories
- **Readability** — Tests focus on behaviour, not data construction
- **Type safety** — Factories enforce correct structure

## Anti-patterns

```typescript
// ❌ Inline object literals everywhere
it('test 1', () => {
  const node = { label: 'X', value: 'y' };
});
it('test 2', () => {
  const node = { label: 'A', value: 'b' };
});

// ✅ Use factories
const createLeaf = (label: string, value: string): Leaf => ({ label, value });

it('test 1', () => {
  const node = createLeaf('X', 'y');
});
it('test 2', () => {
  const node = createLeaf('A', 'b');
});
```

## Existing patterns

Check existing test files for patterns:

- `src/machine/tree/index.spec.ts` — State machine test factories
- `src/machine/tree/nodes.spec.ts` — Type guard test data
- `src/build/parser.spec.ts` — Parser test fixtures

## Source files

- Machine tests: `src/machine/tree/index.spec.ts`
- Node tests: `src/machine/tree/nodes.spec.ts`
- Type definitions: `src/index.ts`

## Read Next

- [Test state machine transitions](./state-machine-tests.md)
- [Test type guards](./type-guard-tests.md)
