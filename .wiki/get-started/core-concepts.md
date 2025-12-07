# How it works

Self-help navigates trees of **nodes**. Each node is either a question (Branch) or an answer (Leaf).

## The four node types

| Type        | Structure                                    | Purpose             |
| ----------- | -------------------------------------------- | ------------------- |
| Leaf        | `{ label, value: string }`                   | Terminal answer     |
| AsyncLeaf   | `{ label, value: () => Promise<string> }`    | Lazy-loaded answer  |
| Branch      | `{ label, children: Node[] }`                | Question + options  |
| AsyncBranch | `{ label, children: () => Promise<Node[]> }` | Lazy-loaded options |

**Key insight:** Every node has a `label`. Branches have `children` (more nodes). Leaves have
`value` (the answer content).

## Type guards

Runtime type checking via guard functions in `src/machine/tree/nodes.ts`:

```typescript
import { isLeaf, isAsyncLeaf, isBranch, isAsyncBranch } from './machine/tree/nodes.js';

if (isLeaf(node)) {
  // node.value is string
}
if (isBranch(node)) {
  // node.children is Node[]
}
```

Use these guards—never type assertions.

## State machine

XState drives navigation. Key states:

```
visitNode (initial)
  ├── [isAsyncBranch] → resolveBranch.loading → success → visitNode
  ├── [isBranch] → renderBranch
  ├── [isAsyncLeaf] → resolveLeaf.loading → success → renderLeaf
  └── [isLeaf] → renderLeaf → FINALISE → renderValue (final)
```

**Events:**

- `SELECT_CHILD { childIndex }` — Navigate to child
- `SELECT_ROOT` — Return to root
- `FINALISE` — Display answer and end
- `RETRY` — Retry failed async load

**Context:**

```typescript
interface TreeContext {
  currentNode: Node; // Node being displayed
  rootNode: Node; // For SELECT_ROOT
  error: Error | null; // Async loading errors
  resolvedValue: string | null; // Resolved AsyncLeaf value
}
```

## Document formats

**Markdown folders (recommended):**

```
docs/
├── README.md           # Branch: H1 = label, links = children
├── branch/
│   ├── README.md       # Sub-branch
│   └── leaf.md         # Leaf: full content is the answer
└── other-leaf.md
```

**JavaScript modules:**

```typescript
export const getHelpDocument = (): Node => ({
  label: 'Root',
  children: [{ label: 'Answer', value: 'Content here' }],
});
```

## Key invariants

1. State transitions via events only—never mutate state directly
2. Commands auto-detect source type (folder vs JS)
3. Type guards determine node type—use `isLeaf()`, not `typeof`
4. All nodes must have `label` plus appropriate `children` or `value`

## Source files

- Type definitions: `src/index.ts`
- Type guards: `src/machine/tree/nodes.ts`
- State machine: `src/machine/tree/index.ts`
- Markdown adapter: `src/source/markdown.ts`
