# Why XState

**Explicit state transitions make navigation predictable and debuggable.**

## The problem

Navigation through a decision tree has many states:

- Loading async children
- Displaying options
- Handling user selection
- Displaying answers
- Handling errors

Manual state management leads to:

- Boolean soup (`isLoading`, `hasError`, `isComplete`)
- Inconsistent states (`isLoading && hasError`)
- Hard-to-trace bugs

## XState benefits

### Explicit states

Every possible state is defined upfront:

```typescript
states: {
  visitNode: { /* ... */ },
  resolveBranch: {
    states: { loading: {}, success: {}, failure: {} }
  },
  renderBranch: { /* ... */ },
  renderLeaf: { /* ... */ },
  renderValue: { /* ... */ }
}
```

Impossible to be in an undefined state.

### Declarative transitions

Transitions are predictable:

```typescript
on: {
  SELECT_CHILD: { target: 'visitNode', actions: 'navigateToChild' }
}
```

### Built-in async handling

```typescript
invoke: {
  src: 'getChildren',
  onDone: { target: 'success' },
  onError: { target: 'failure' }
}
```

No manual promise handling or try/catch blocks in the machine.

### Guards prevent invalid transitions

```typescript
guards: {
  isLeaf: ({ context }) => isLeaf(context.currentNode),
  isBranch: ({ context }) => isBranch(context.currentNode)
}
```

### Visual debugging

XState Inspector shows:

- Current state
- Available transitions
- State history
- Context values

## Trade-offs

| Benefit          | Cost                     |
| ---------------- | ------------------------ |
| Explicit states  | Learning curve           |
| Predictable flow | More boilerplate         |
| Visual debugging | Dependency (~50kb)       |
| Type safety      | Strict patterns required |

## Alternative: Manual state

```typescript
// ❌ Manual state — easy to get wrong
let currentState = 'idle';
let isLoading = false;
let error = null;

async function navigate(node) {
  isLoading = true;
  try {
    const children = await loadChildren(node);
    isLoading = false;
    currentState = 'ready';
  } catch (e) {
    isLoading = false;
    error = e;
    // currentState still 'idle'? 'error'? Unclear.
  }
}
```

```typescript
// ✅ XState — states are explicit
resolveBranch: {
  initial: 'loading',
  states: {
    loading: {
      invoke: {
        src: 'getChildren',
        onDone: 'success',
        onError: 'failure'
      }
    },
    success: { /* ... */ },
    failure: {
      on: { RETRY: 'loading' }
    }
  }
}
```

## When XState fits

- Complex state transitions
- Async operations with error handling
- Need for visual debugging
- Long-lived interactions (navigation, wizards)

## Source files

- Machine: `src/machine/tree/index.ts`
- Tests: `src/machine/tree/index.spec.ts`

## Read Next

- [Why type guards](./why-type-guards.md)
- [How it works](../get-started/core-concepts.md)
