# How to contribute

## Read First

- [How it works](./core-concepts.md)
- [Codebase map](./codebase-map.md)

For general rules (ask vs proceed, code quality, communication style, before committing), see
[.cursorrules](../../../.cursorrules).

This page covers project-specific scope boundaries and import conventions.

## Scope boundaries

Don't modify without discussion:

- State machine structure (`src/machine/tree/index.ts`)
- Node type definitions (`src/index.ts`)
- Public API types (breaking changes)
- Working commands

Don't add/remove:

- Dependencies without discussion
- Tests (unless fixing bugs or adding features)
- Files unless explicitly requested

## Import conventions

```typescript
// External deps first
import { type Actor, assign, createActor, createMachine } from 'xstate';

// Internal imports with .js extension (required for ESM)
import type { Branch, Leaf, Node } from './index.js';
import { isLeaf, isBranch } from './machine/tree/nodes.js';
```

**Key points:**

- Group external before internal
- Always use `.js` extension for internal imports (ESM requirement)
- Use `type` keyword for type-only imports
