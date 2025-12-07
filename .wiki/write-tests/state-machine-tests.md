# Test state machine transitions

## Read First

- [How it works](../get-started/core-concepts.md)
- [How to contribute](../get-started/contribution-guidelines.md)

## Read Next

- [Test type guards](./type-guard-tests.md)
- [Create test factories](./test-data-factories.md)

---

**Test transitions and context updates using XState's actor API.**

## File location

Tests: `src/machine/tree/index.spec.ts`

## Test structure

```typescript
import { describe, expect, it } from 'vitest';
import { createActor, waitFor } from 'xstate';
import { createTreeInterpreter, createTreeMachine } from './index.js';
import type { Branch, Leaf, Node } from '../../index.js';

describe('tree machine', () => {
  // Factory functions
  const createLeaf = (label: string, value: string): Leaf => ({ label, value });
  const createBranch = (label: string, children: Node[]): Branch => ({ label, children });

  // Tests...
});
```

## Testing sync transitions

```typescript
it('should transition to renderLeaf when starting with a leaf', () => {
  const rootNode = createLeaf('Leaf Node', 'leaf value');
  const actor = createTreeInterpreter(rootNode);

  actor.start();

  expect(actor.getSnapshot().value).toBe('renderLeaf');
});

it('should transition to renderBranch when starting with a branch', () => {
  const child = createLeaf('Child', 'value');
  const rootNode = createBranch('Root', [child]);
  const actor = createTreeInterpreter(rootNode);

  actor.start();

  expect(actor.getSnapshot().value).toBe('renderBranch');
});
```

## Testing events

```typescript
it('should navigate to child on SELECT_CHILD', () => {
  const child = createLeaf('Child', 'child value');
  const rootNode = createBranch('Root', [child]);
  const actor = createTreeInterpreter(rootNode);

  actor.start();
  actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

  expect(actor.getSnapshot().value).toBe('renderLeaf');
  expect(actor.getSnapshot().context.currentNode).toBe(child);
});

it('should return to root on SELECT_ROOT', () => {
  const child = createLeaf('Child', 'value');
  const rootNode = createBranch('Root', [child]);
  const actor = createTreeInterpreter(rootNode);

  actor.start();
  actor.send({ type: 'SELECT_CHILD', childIndex: 0 });
  actor.send({ type: 'SELECT_ROOT' });

  expect(actor.getSnapshot().context.currentNode).toBe(rootNode);
});
```

## Testing async transitions

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
    children: () => Promise.reject(new Error('Load failed')),
  };
  const actor = createActor(createTreeMachine(rootNode));

  actor.start();

  await waitFor(actor, (state) => state.matches({ resolveBranch: 'failure' }));

  expect(actor.getSnapshot().context.error).toBeDefined();
});
```

## Testing context updates

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

it('should preserve rootNode in context', () => {
  const child = createLeaf('Child', 'value');
  const rootNode = createBranch('Root', [child]);
  const actor = createTreeInterpreter(rootNode);

  actor.start();
  actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

  expect(actor.getSnapshot().context.rootNode).toBe(rootNode);
});
```

## Key patterns

- Use `createTreeInterpreter()` for simple sync tests
- Use `createActor(createTreeMachine())` when you need more control
- Use `waitFor()` for async state transitions
- Always call `actor.start()` before sending events
- Use `actor.getSnapshot().value` for state checks
- Use `actor.getSnapshot().context` for context checks
- Use `state.matches()` for nested state checks (e.g., `{ resolveBranch: 'loading' }`)

## Common mistakes

- ❌ Forgetting `actor.start()` before assertions
- ❌ Not awaiting async transitions
- ❌ Checking state before transition completes
- ❌ Sharing actors between tests (create fresh per test)
