# Why type guards

**Runtime safety with TypeScript narrowing.** User-provided data can't be trusted at compile time.

## The problem

TypeScript types are erased at runtime. User data (from files, APIs) has no compile-time guarantee:

```typescript
// This compiles but crashes at runtime if data is wrong
const node = data as Leaf;
console.log(node.value); // 💥 TypeError if not actually a Leaf
```

## The solution

Type guard functions validate structure at runtime:

```typescript
export const isLeaf = (value: unknown): value is Leaf =>
  hasLabel(value) && isString(get(value, 'value'));

// Safe usage
if (isLeaf(node)) {
  console.log(node.value); // ✅ TypeScript knows node is Leaf
}
```

## Benefits

### Runtime safety

Guards reject invalid data before it causes errors deeper in the codebase.

### TypeScript narrowing

After a guard check, TypeScript knows the type:

```typescript
function process(node: Node) {
  if (isLeaf(node)) {
    // TypeScript knows: node is Leaf
    return node.value;
  }
  if (isBranch(node)) {
    // TypeScript knows: node is Branch
    return node.children;
  }
}
```

### Single source of truth

All type checks in one module (`src/machine/tree/nodes.ts`):

- Consistent validation logic
- Easy to update when node structure changes
- XState guards use the same functions

### XState integration

Machine guards use type guards directly:

```typescript
guards: {
  isLeaf: ({ context }) => isLeaf(context.currentNode),
  isBranch: ({ context }) => isBranch(context.currentNode),
}
```

## Trade-offs

| Benefit                | Cost                                 |
| ---------------------- | ------------------------------------ |
| Runtime safety         | Performance overhead (negligible)    |
| TypeScript narrowing   | More verbose than assertions         |
| Single source of truth | Must update guards when types change |

## Alternatives considered

### Type assertions (`as`)

```typescript
const leaf = data as Leaf;
```

**Rejected:** No runtime check. Crashes when data is wrong.

### `instanceof` checks

```typescript
if (data instanceof Leaf) { ... }
```

**Rejected:** Doesn't work with plain objects. Only works with classes.

### Schema validation (Zod, etc.)

```typescript
const LeafSchema = z.object({ label: z.string(), value: z.string() });
```

**Considered:** Powerful but adds dependency. Type guards are simpler for this use case.

## Implementation

Guards in `src/machine/tree/nodes.ts`:

```typescript
import { isString, isFunction, isArray, get } from '../../lib/utils.js';

const hasLabel = (value: unknown): boolean => isString(get(value, 'label'));

export const isLeaf = (value: unknown): value is Leaf =>
  hasLabel(value) && isString(get(value, 'value'));

export const isAsyncLeaf = (value: unknown): value is AsyncLeaf =>
  hasLabel(value) && isFunction(get(value, 'value'));

export const isBranch = (value: unknown): value is Branch =>
  hasLabel(value) && isChildren(children(value));

export const isAsyncBranch = (value: unknown): value is AsyncBranch =>
  hasLabel(value) && isFunction(children(value));
```

## Source files

- Type guards: `src/machine/tree/nodes.ts`
- Guard tests: `src/machine/tree/nodes.spec.ts`
- Utility functions: `src/lib/utils.ts`
- Type definitions: `src/index.ts`

## Read Next

- [Why XState](./why-xstate.md)
- [How it works](../get-started/core-concepts.md)
