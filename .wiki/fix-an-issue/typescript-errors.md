# TypeScript errors

**Read the error message carefully.** Most errors point directly to the problem.

## Common errors and fixes

### Missing `.js` extension

```
Cannot find module './nodes' or its corresponding type declarations.
```

**Fix:** Add `.js` extension to imports (required for NodeNext):

```typescript
// ❌ Wrong
import { isLeaf } from './nodes';

// ✅ Correct
import { isLeaf } from './nodes.js';
```

### Type guard not narrowing

```
Property 'value' does not exist on type 'Node'.
```

**Fix:** Use type guard before accessing properties:

```typescript
// ❌ Wrong
const v = node.value;

// ✅ Correct
if (isLeaf(node)) {
  const v = node.value;
}
```

### Assign type mismatch

```
Type '...' is not assignable to type '...'.
```

**Fix:** Check XState `assign()` action returns correct type:

```typescript
// ❌ Wrong
actions: assign({ currentNode: undefined });

// ✅ Correct
actions: assign({ currentNode: ({ event }) => event.node });
```

### Unknown type in event

```
Property 'childIndex' does not exist on type 'EventObject'.
```

**Fix:** Add event type definition:

```typescript
type TreeEvent =
  | { type: 'SELECT_CHILD'; childIndex: number }
  | { type: 'SELECT_ROOT' }
  | { type: 'FINALISE' };
```

### Implicit any

```
Parameter 'x' implicitly has an 'any' type.
```

**Fix:** Add explicit type annotation:

```typescript
// ❌ Wrong
const fn = (x) => x.label;

// ✅ Correct
const fn = (x: Node) => x.label;
```

## Debugging approach

1. Read full error message—location + cause
2. Check if import has `.js` extension
3. Check if type guard is used before property access
4. Verify function parameter types
5. Run `pnpm build` to see all errors

## Source files with types

- Public types: `src/index.ts`
- Machine types: `src/machine/tree/index.ts`
- Build types: `src/build/types.ts`
- Utility types: `src/lib/utils.ts`

## Read Next

- [Tests failing](./tests-failing.md)
- [State machine stuck](./state-machine-stuck.md)
