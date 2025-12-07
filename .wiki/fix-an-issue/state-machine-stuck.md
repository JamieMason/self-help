# State machine stuck

## Read First

- [How it works](../get-started/core-concepts.md)

## Quick diagnosis

**Check guards first.** Most stuck states come from guards returning false.

```typescript
// Add to see current state
console.log(actor.getSnapshot().value);
console.log(actor.getSnapshot().context);
```

## Common causes

1. **Guard returning false** — Node doesn't match expected type
2. **Wrong event type** — Spelling must match exactly
3. **Missing `.js` extension** — NodeNext requires it in imports
4. **Async not resolving** — Check `fromPromise` actor is invoked

## Debugging steps

1. Log in type guards (`src/machine/tree/nodes.ts`):

```typescript
export const isLeaf = (value: unknown): value is Leaf => {
  const result = hasLabel(value) && isString(get(value, 'value'));
  console.log('isLeaf:', value, result);
  return result;
};
```

2. Log before `actor.send()` calls:

```typescript
console.log('Sending event:', event);
actor.send(event);
```

3. Verify node has correct structure:
   - Leaf: `label` + `value` (string)
   - AsyncLeaf: `label` + `value` (function)
   - Branch: `label` + `children` (array)
   - AsyncBranch: `label` + `children` (function)

4. Subscribe to all transitions:

```typescript
actor.subscribe((snapshot) => {
  console.log('State:', snapshot.value);
  console.log('Context:', snapshot.context);
});
```

## State transition reference

```
visitNode (initial)
  ├── [isAsyncBranch] → resolveBranch.loading
  ├── [isBranch] → renderBranch
  ├── [isAsyncLeaf] → resolveLeaf.loading
  └── [isLeaf] → renderLeaf
```

If stuck at `visitNode`, none of the guards matched—your node structure is wrong.

## Source files

- Machine: `src/machine/tree/index.ts`
- Guards: `src/machine/tree/nodes.ts`
- Tests: `src/machine/tree/index.spec.ts`

## Read Next

- [Tests failing](./tests-failing.md)
- [TypeScript errors](./typescript-errors.md)
