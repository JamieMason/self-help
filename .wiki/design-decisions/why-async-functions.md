# Why async functions

**Lazy loading.** AsyncBranch and AsyncLeaf defer loading until the user navigates there.

## The pattern

```typescript
// AsyncBranch: children loaded on demand
interface AsyncBranch {
  label: string;
  children: () => Promise<Node[]>; // Function, not data
}

// AsyncLeaf: value loaded on demand
interface AsyncLeaf {
  label: string;
  value: () => string | Promise<string>; // Function, not data
}
```

## Why functions, not promises?

```typescript
// ❌ Promise starts loading immediately
children: Promise.resolve([...])

// ✅ Function waits until called
children: () => fetch('/api/nodes')
```

Functions defer execution. Promises execute immediately upon creation.

## Benefits

### Performance

- Large documents don't load everything upfront
- Only fetches data when user navigates to that branch
- Reduces initial load time

### Composability

- Documents can link to external sources
- Different teams can maintain different sections
- Remote content can be fetched on demand

### Modularity

- Split large wikis into separate files
- Load documentation from APIs
- Dynamic content based on context

## Use cases

### Remote content

```typescript
const asyncBranch: AsyncBranch = {
  label: 'API Documentation',
  children: () => fetch('/api/docs').then((r) => r.json()),
};
```

### File-based lazy loading

```typescript
// Markdown folders use this pattern
const asyncBranch: AsyncBranch = {
  label: 'Topic',
  children: async () => {
    const files = await readdir('./topic');
    return files.map(parseFile);
  },
};
```

### Conditional content

```typescript
const asyncLeaf: AsyncLeaf = {
  label: 'Current Status',
  value: async () => {
    const status = await checkStatus();
    return formatStatus(status);
  },
};
```

## State machine integration

XState handles async naturally with `fromPromise`:

```typescript
resolveBranch: {
  states: {
    loading: {
      invoke: {
        src: 'getChildren',  // Calls children()
        onDone: { target: 'success' },
        onError: { target: 'failure' },
      },
    },
    success: { /* ... */ },
    failure: { /* RETRY available */ },
  }
}
```

The machine manages loading states, errors, and retry logic automatically.

## Trade-offs

| Benefit        | Cost                          |
| -------------- | ----------------------------- |
| Lazy loading   | Slightly more complex types   |
| Remote content | Network latency on navigation |
| Modularity     | Error handling needed         |

## Alternatives considered

| Alternative             | Why rejected                   |
| ----------------------- | ------------------------------ |
| Load everything upfront | Doesn't scale for large docs   |
| Promise properties      | Loads immediately, can't retry |
| Event-based loading     | More complex, less composable  |

## Source files

- Type definitions: `src/index.ts`
- Markdown adapter: `src/source/markdown.ts`
- State machine: `src/machine/tree/index.ts`

## Read Next

- [Why markdown folders](./why-markdown-folders.md)
- [Why XState](./why-xstate.md)
