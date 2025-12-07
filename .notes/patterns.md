# Design Patterns in Self-Help

This document explains the design patterns used in Self-Help and the rationale behind them.

## Table of Contents

- [State Machine Pattern](#state-machine-pattern)
- [Type Guard Pattern](#type-guard-pattern)
- [Factory Pattern for Tests](#factory-pattern-for-tests)
- [Lazy Loading Pattern](#lazy-loading-pattern)
- [Command Pattern](#command-pattern)
- [Subscription Pattern](#subscription-pattern)

---

## State Machine Pattern

### Pattern

Navigation through the decision tree is driven by an XState state machine:

```
visitNode → [guards] → resolveBranch | renderBranch | renderLeaf
                              ↓              ↓              ↓
                         loading...    SELECT_CHILD     FINALISE
                              ↓              ↓              ↓
                          success       visitNode     renderValue
```

### Rationale

**Explicit State Transitions:**

- Every possible state is defined upfront
- Transitions are declarative and predictable
- Impossible to be in an undefined state

**Benefits:**

- Easy to reason about navigation flow
- Built-in support for async operations
- Visual debugging with XState tools
- Guards prevent invalid transitions
- Actions are side-effect free assignments

**Why XState Over Manual State?**

```typescript
// DON'T: Manual state management
let currentState = 'idle';
let isLoading = false;
let error = null;
// Easy to get into inconsistent states

// DO: XState machine
const machine = createMachine({
  states: {
    visitNode: {
      /* ... */
    },
    renderBranch: {
      /* ... */
    },
    // All states explicitly defined
  },
});
```

---

## Type Guard Pattern

### Pattern

Runtime type checking using type guard functions:

```typescript
export const isLeaf = (value: unknown): value is Leaf =>
  hasLabel(value) && isString(get(value, 'value'));

export const isBranch = (value: unknown): value is Branch =>
  hasLabel(value) && isChildren(children(value));

export const isAsyncBranch = (value: unknown): value is AsyncBranch =>
  hasLabel(value) && isFunction(children(value));
```

### Rationale

**Type Safety at Runtime:**

- User-provided data cannot be trusted at compile time
- Type guards validate structure before use
- TypeScript narrowing provides autocomplete after check

**Single Source of Truth:**

- All type checks in one module (`nodes.ts`)
- Consistent validation logic
- Easy to update when node structure changes

**Benefits:**

- XState guards use same functions
- No duplicate type-checking logic
- Clear error messages when validation fails

**Why Not Type Assertions?**

```typescript
// DON'T: Type assertions
const node = data as Node;
// No runtime check, could crash later

// DO: Type guards
if (isNode(data)) {
  // Safe to use, TypeScript knows the type
}
```

---

## Factory Pattern for Tests

### Pattern

Tests use factory functions to create test data:

```typescript
const createLeaf = (label: string, value: string): Leaf => ({
  label,
  value,
});

const createBranch = (label: string, children: Node[]): Branch => ({
  label,
  children,
});
```

### Rationale

**Ergonomics:**

- Concise syntax for creating test nodes
- Default values can be provided
- Type-safe construction

**Consistency:**

- All tests create nodes the same way
- Changes to node structure only affect factories
- Reduces test maintenance burden

**Benefits:**

- Tests focus on behaviour, not data construction
- Easy to create complex nested structures
- Readable and self-documenting tests

**Example Usage:**

```typescript
it('should navigate nested branches', () => {
  const leaf = createLeaf('Answer', 'The answer is 42');
  const child = createBranch('Nested', [leaf]);
  const root = createBranch('Root', [child]);

  const actor = createTreeInterpreter(root);
  actor.start();
  // Test navigation...
});
```

---

## Lazy Loading Pattern

### Pattern

AsyncBranch defers loading children until needed:

```typescript
interface AsyncBranch {
  label: string;
  children: () => Promise<Node[]>; // Function, not data
}
```

### Rationale

**Performance:**

- Large documents don't load everything upfront
- Only fetches data when user navigates to that branch
- Reduces initial load time

**Composability:**

- Documents can link to external sources
- Different teams can maintain different sections
- Remote documents can be fetched on demand

**Benefits:**

- Better user experience for large documents
- Enables modular documentation
- Supports dynamic content from APIs

**State Machine Integration:**

```typescript
resolveBranch: {
  states: {
    loading: {
      invoke: {
        src: 'getChildren',  // Calls the async function
        onDone: { target: 'success' },
        onError: { target: 'failure' },
      },
    },
    // ...
  }
}
```

**Why Functions Not Promises?**

```typescript
// DON'T: Promise directly
children: Promise.resolve([...])  // Starts loading immediately

// DO: Function returning Promise
children: () => fetch('/api/nodes')  // Only loads when called
```

---

## Command Pattern

### Pattern

Each CLI command follows the same structure:

```typescript
export const run = async ({ sourcePath }: { sourcePath: string }) => {
  // 1. Resolve path
  const dataPath = resolve(process.cwd(), sourcePath);
  const fileUrl = pathToFileURL(dataPath).href;

  // 2. Load source
  const source = await tryPanicAsync(() => import(fileUrl), ERROR_MSG);

  // 3. Get document
  const tree = await tryPanicAsync(() => source.getHelpDocument(), ERROR_MSG);

  // 4. Process tree
  // Command-specific logic...
};
```

### Rationale

**Consistency:**

- All commands load documents the same way
- Error handling is uniform
- Easy to add new commands

**Separation of Concerns:**

- Loading logic is distinct from processing
- Each step can fail independently
- Clear error messages per step

**Benefits:**

- New commands follow established pattern
- Shared utilities (tryPanicAsync, resolve, etc.)
- Testable in isolation

---

## Subscription Pattern

### Pattern

The interactive command subscribes to state machine changes:

```typescript
actor.subscribe((snapshot) => {
  const state = snapshot.value;
  const context = snapshot.context;

  if (snapshot.matches('renderBranch')) {
    // Display options
  } else if (snapshot.matches('renderLeaf')) {
    // Display leaf
  } else if (snapshot.matches({ resolveBranch: 'loading' })) {
    // Show loading indicator
  }
});

actor.start();
```

### Rationale

**Reactive Updates:**

- UI responds to state changes automatically
- No manual state synchronisation needed
- Single source of truth (the actor)

**Decoupling:**

- State machine doesn't know about UI
- UI just reacts to state
- Easy to swap UI implementations

**Benefits:**

- Clean separation of logic and presentation
- Consistent handling of all states
- Easy to add new UI behaviours

**Why Subscribe Not Poll?**

```typescript
// DON'T: Polling
setInterval(() => {
  const state = actor.getSnapshot();
  // Check state...
}, 100);

// DO: Subscribe
actor.subscribe((snapshot) => {
  // React immediately to changes
});
```

---

## Summary

These patterns work together to create a system that is:

1. **Predictable** - State machine with explicit transitions
2. **Type-Safe** - Type guards for runtime validation
3. **Testable** - Factory functions for test data
4. **Performant** - Lazy loading for large documents
5. **Consistent** - Command pattern for CLI structure
6. **Reactive** - Subscription pattern for UI updates

The patterns reinforce each other:

- Type guards enable state machine guards
- Factory functions make testing state transitions easy
- Lazy loading integrates with state machine's async handling
- Command pattern ensures consistent document loading
- Subscription pattern connects state machine to UI

When adding features, follow these patterns to maintain consistency and quality.
