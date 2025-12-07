# Add a node type

## Read First

- [How it works](../get-started/core-concepts.md)
- [How to contribute](../get-started/contribution-guidelines.md)

**Add type definition in `src/index.ts`, guard in `src/machine/tree/nodes.ts`, and tests.**

## Steps

1. Define the type interface in `src/index.ts`
2. Add type guard in `src/machine/tree/nodes.ts`
3. Update the `Node` union type
4. Add guard to machine if needed
5. Write tests in `src/machine/tree/nodes.spec.ts`

## Type definition

```typescript
// src/index.ts
export interface YourNodeType {
  label: string;
  yourProperty: YourPropertyType;
}

// Update union type
export type Node = Leaf | AsyncLeaf | Branch | AsyncBranch | YourNodeType;
```

## Type guard

```typescript
// src/machine/tree/nodes.ts
import { isString, isFunction, get } from '../../lib/utils.js';

export const isYourNodeType = (value: unknown): value is YourNodeType =>
  hasLabel(value) && isString(get(value, 'yourProperty'));
```

**Key pattern:** Guards use utility functions (`isString`, `isArray`, `isFunction`) and `get()` for
safe property access.

## Existing guards for reference

```typescript
// Leaf: has string value
export const isLeaf = (value: unknown): value is Leaf =>
  hasLabel(value) && isString(get(value, 'value'));

// AsyncLeaf: has function value
export const isAsyncLeaf = (value: unknown): value is AsyncLeaf =>
  hasLabel(value) && isFunction(get(value, 'value'));

// Branch: has array children
export const isBranch = (value: unknown): value is Branch =>
  hasLabel(value) && isChildren(children(value));

// AsyncBranch: has function children
export const isAsyncBranch = (value: unknown): value is AsyncBranch =>
  hasLabel(value) && isFunction(children(value));
```

## Machine guard (if needed)

```typescript
// src/machine/tree/index.ts
guards: {
  isYourNodeType: ({ context }) => isYourNodeType(context.currentNode);
}
```

## Testing type guards

```typescript
// src/machine/tree/nodes.spec.ts
describe('isYourNodeType', () => {
  it('should return true for valid node', () => {
    const node = { label: 'Test', yourProperty: 'value' };
    expect(isYourNodeType(node)).toBe(true);
  });

  it('should return false without label', () => {
    const node = { yourProperty: 'value' };
    expect(isYourNodeType(node)).toBe(false);
  });

  it('should return false with wrong property type', () => {
    const node = { label: 'Test', yourProperty: 123 };
    expect(isYourNodeType(node)).toBe(false);
  });

  it('should return false for null/undefined', () => {
    expect(isYourNodeType(null)).toBe(false);
    expect(isYourNodeType(undefined)).toBe(false);
  });
});
```

## Source files

- Type definitions: `src/index.ts`
- Type guards: `src/machine/tree/nodes.ts`
- Guard tests: `src/machine/tree/nodes.spec.ts`
- Utility functions: `src/lib/utils.ts`

## Common mistakes

- ❌ Type assertions (`as YourType`) → ✅ Use type guards
- ❌ Direct property access → ✅ Use `get()` for safe access
- ❌ Missing `hasLabel` check → ✅ All nodes must have label
- ❌ Forgetting to update Node union → ✅ Add to union type

## Read Next

- [Test type guards](../write-tests/type-guard-tests.md)
