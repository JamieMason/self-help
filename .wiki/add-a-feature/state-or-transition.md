# Add a state or transition

## Read First

- [How it works](../get-started/core-concepts.md)
- [How to contribute](../get-started/contribution-guidelines.md)

**Edit `src/machine/tree/index.ts`** to modify XState machine behaviour.

## Adding a state

1. Add state definition in `states` object:

```typescript
states: {
  // ... existing states
  yourNewState: {
    on: {
      YOUR_EVENT: {
        target: 'nextState';
      }
    }
  }
}
```

2. Add transition(s) to reach the new state
3. Add tests in `src/machine/tree/index.spec.ts`

## Adding a transition

1. Find the source state in `states`
2. Add event handler in `on`:

```typescript
yourState: {
  on: {
    NEW_EVENT: {
      target: 'targetState',
      guard: 'optionalGuard',
      actions: 'optionalAction'
    }
  }
}
```

3. If using a guard, add it to `guards` object
4. If using an action, add it to `actions` object
5. Add tests for the new transition

## Adding a guard

Guards determine if a transition can occur:

```typescript
guards: {
  isYourCondition: ({ context }) => {
    return someCheck(context.currentNode);
  };
}
```

Use existing type guards from `src/machine/tree/nodes.ts` when checking node types.

## Adding an action

Actions run during transitions:

```typescript
actions: {
  yourAction: assign({
    someProperty: ({ context, event }) => newValue,
  });
}
```

**Never mutate context directly**—always use `assign()`.

## Adding async behaviour

Use `fromPromise` for async operations:

```typescript
import { fromPromise } from 'xstate';

// In actors object
actors: {
  loadSomething: fromPromise(async ({ input }) => {
    const result = await fetchData(input);
    return result;
  })
}

// In state
loading: {
  invoke: {
    src: 'loadSomething',
    input: ({ context }) => context.someValue,
    onDone: {
      target: 'success',
      actions: assign({ data: ({ event }) => event.output })
    },
    onError: {
      target: 'failure',
      actions: assign({ error: ({ event }) => event.error })
    }
  }
}
```

## Source files

- Machine definition: `src/machine/tree/index.ts`
- Type guards: `src/machine/tree/nodes.ts`
- Tests: `src/machine/tree/index.spec.ts`

## Common mistakes

- ❌ Mutating context directly → ✅ Use `assign()`
- ❌ Missing `.js` extension in imports → ✅ Required for NodeNext
- ❌ Unreachable states → ✅ Ensure transitions lead to new state
- ❌ Type assertions → ✅ Use type guards

## Read Next

- [Test state machine transitions](../write-tests/state-machine-tests.md)
