# Test type guards

## Read First

- [How it works](../get-started/core-concepts.md)
- [How to contribute](../get-started/contribution-guidelines.md)

**Test each guard with valid, invalid, and edge cases.** Guards must reject unexpected input safely.

## File location

- Tests: `src/machine/tree/nodes.spec.ts`
- Guards: `src/machine/tree/nodes.ts`

## Test pattern

```typescript
import { describe, expect, it } from 'vitest';
import { isLeaf, isAsyncLeaf, isBranch, isAsyncBranch } from './nodes.js';

describe('isLeaf', () => {
  it('should return true for valid leaf', () => {
    const leaf = { label: 'Test', value: 'content' };
    expect(isLeaf(leaf)).toBe(true);
  });

  it('should return false without label', () => {
    const invalid = { value: 'content' };
    expect(isLeaf(invalid)).toBe(false);
  });

  it('should return false with non-string value', () => {
    const invalid = { label: 'Test', value: 123 };
    expect(isLeaf(invalid)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isLeaf(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isLeaf(undefined)).toBe(false);
  });
});
```

## Test cases for each guard

### Leaf

| Input                        | Expected | Reason           |
| ---------------------------- | -------- | ---------------- |
| `{ label: 'L', value: 'v' }` | `true`   | Valid leaf       |
| `{ value: 'v' }`             | `false`  | Missing label    |
| `{ label: 'L' }`             | `false`  | Missing value    |
| `{ label: 'L', value: 123 }` | `false`  | Wrong value type |
| `null`                       | `false`  | Null input       |
| `undefined`                  | `false`  | Undefined input  |

### AsyncLeaf

| Input                              | Expected | Reason                        |
| ---------------------------------- | -------- | ----------------------------- |
| `{ label: 'L', value: () => 'v' }` | `true`   | Valid async leaf              |
| `{ label: 'L', value: 'v' }`       | `false`  | Value is string, not function |
| `{ value: () => 'v' }`             | `false`  | Missing label                 |

### Branch

| Input                                   | Expected | Reason               |
| --------------------------------------- | -------- | -------------------- |
| `{ label: 'B', children: [leaf] }`      | `true`   | Valid branch         |
| `{ label: 'B', children: [] }`          | `false`  | Empty children array |
| `{ children: [leaf] }`                  | `false`  | Missing label        |
| `{ label: 'B', children: 'not array' }` | `false`  | Wrong children type  |

### AsyncBranch

| Input                                                 | Expected | Reason                          |
| ----------------------------------------------------- | -------- | ------------------------------- |
| `{ label: 'B', children: () => Promise.resolve([]) }` | `true`   | Valid async branch              |
| `{ label: 'B', children: [] }`                        | `false`  | Children is array, not function |
| `{ children: () => [] }`                              | `false`  | Missing label                   |

## Test factories

Use factories for consistent test data:

```typescript
const createLeaf = (label: string, value: string): Leaf => ({ label, value });

const createAsyncLeaf = (label: string, value: string): AsyncLeaf => ({
  label,
  value: () => Promise.resolve(value),
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

## Edge cases to test

```typescript
describe('edge cases', () => {
  it('should handle object with extra properties', () => {
    const node = { label: 'L', value: 'v', extra: 'ignored' };
    expect(isLeaf(node)).toBe(true);
  });

  it('should handle empty string label', () => {
    const node = { label: '', value: 'v' };
    expect(isLeaf(node)).toBe(true); // Empty string is valid
  });

  it('should distinguish leaf from async leaf', () => {
    const leaf = { label: 'L', value: 'string' };
    const asyncLeaf = { label: 'L', value: () => 'string' };

    expect(isLeaf(leaf)).toBe(true);
    expect(isAsyncLeaf(leaf)).toBe(false);
    expect(isLeaf(asyncLeaf)).toBe(false);
    expect(isAsyncLeaf(asyncLeaf)).toBe(true);
  });
});
```

## Running tests

```bash
# Run all node tests
pnpm test -- nodes.spec

# Run specific guard tests
pnpm test -- -t "isLeaf"

# Watch mode
pnpm test -- nodes.spec --watch
```

## Read Next

- [Create test factories](./test-data-factories.md)
- [Test state machine transitions](./state-machine-tests.md)
