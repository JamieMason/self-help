# Tests failing

**Read the error message carefully.** Most failures tell you exactly what's wrong.

## Quick diagnosis

```bash
# Run specific test file
pnpm test -- nodes.spec

# Run with verbose output
pnpm test -- --reporter=verbose

# Run single test by name
pnpm test -- -t "should transition to renderLeaf"
```

## Common causes

| Error                               | Likely cause                          |
| ----------------------------------- | ------------------------------------- |
| `undefined is not a function`       | Missing `.js` extension in import     |
| `Expected X but received Y`         | Logic error or stale test expectation |
| `Timeout`                           | Async operation never resolves        |
| `Cannot read property of undefined` | Null/undefined value not handled      |
| `state.matches(...) is false`       | Wrong state or machine never started  |

## Async test issues

Use `waitFor` for async state transitions:

```typescript
import { waitFor } from 'xstate';

it('should resolve async branch', async () => {
  const actor = createActor(createTreeMachine(asyncBranch));
  actor.start();

  // Wait for state transition
  await waitFor(actor, (state) => state.matches('renderBranch'), {
    timeout: 5000,
  });

  expect(actor.getSnapshot().value).toBe('renderBranch');
});
```

## Test isolation

Each test should be independent:

```typescript
// DON'T: Share state between tests
let actor;
beforeAll(() => {
  actor = createTreeInterpreter(node);
});

// DO: Create fresh instances per test
it('should work', () => {
  const actor = createTreeInterpreter(node);
  actor.start();
  // ...
});
```

## Debugging techniques

### Log state transitions

```typescript
actor.subscribe((snapshot) => {
  console.log('State:', snapshot.value);
  console.log('Context:', JSON.stringify(snapshot.context, null, 2));
});
```

### Check actual vs expected

```typescript
console.log('Actual:', actor.getSnapshot().value);
console.log('Expected:', 'renderBranch');
console.log('Context:', actor.getSnapshot().context);
```

### Isolate the failing test

```bash
# Run only one test
pnpm test -- -t "exact test name"
```

## Test pattern reference

```typescript
// Sync state transition
it('should transition to renderLeaf', () => {
  const rootNode = createLeaf('Leaf', 'value');
  const actor = createTreeInterpreter(rootNode);
  actor.start();
  expect(actor.getSnapshot().value).toBe('renderLeaf');
});

// Async state transition
it('should resolve async branch', async () => {
  const actor = createActor(createTreeMachine(asyncBranch));
  actor.start();
  await waitFor(actor, (s) => s.matches('renderBranch'));
  expect(actor.getSnapshot().value).toBe('renderBranch');
});

// Event handling
it('should navigate on SELECT_CHILD', () => {
  const actor = createTreeInterpreter(branch);
  actor.start();
  actor.send({ type: 'SELECT_CHILD', childIndex: 0 });
  expect(actor.getSnapshot().context.currentNode).toBe(child);
});
```

## Source files

- Machine tests: `src/machine/tree/index.spec.ts`
- Node tests: `src/machine/tree/nodes.spec.ts`
- Parser tests: `src/build/parser.spec.ts`
- Lint tests: `src/lint.spec.ts`

## Read Next

- [State machine stuck](./state-machine-stuck.md)
- [TypeScript errors](./typescript-errors.md)
