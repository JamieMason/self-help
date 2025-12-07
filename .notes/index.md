# Self-Help Development Hub

<ai_guidance> AI ASSISTANTS: This is the central navigation hub for Self-Help development. Always
read this file first to understand the codebase structure and find the right documentation for your
task. </ai_guidance>

<project_description> **Self-Help** is a TypeScript CLI tool for creating interactive Q&A guides and
decision trees. Users author help documents as JavaScript modules, then navigate them interactively
in the terminal or export them as Markdown documentation. </project_description>

<quick_start>

## Quick Start for AI Assistants

**ALWAYS read these first:**

1. `.notes/context.md` - Essential mental model and core concepts
2. This file - Navigation and task guidance

**Architecture:** XState state machine navigates a tree of Nodes (Leaf | Branch | AsyncBranch)

</quick_start>

<task_navigation>

## Task-Oriented Navigation

<task type="library_docs">

### "I need documentation for external libraries"

- **When to use:** XState, Vitest, marked, @clack/prompts, sade
- **Tools:** `resolve-library-id`, `get-library-docs` (Context7)
- **Don't use for:** Self-Help internal code (use grep instead)

</task>

<task type="node_types">

### "I need to work with node types"

- **Type definitions:** `src/index.ts`
- **Type guards:** `src/machine/tree/nodes.ts`
- **Tests:** `src/machine/tree/nodes.spec.ts`

<node_types>

**Node type reference:**

- `Leaf` - `{ label: string, value: string }` - Terminal with answer
- `Branch` - `{ label: string, children: Node[] }` - Sync children
- `AsyncBranch` - `{ label: string, children: () => Promise<Node[]> }` - Async children

</node_types>

</task>

<task type="state_machine">

### "I need to modify navigation/state machine"

- **Machine definition:** `src/machine/tree/index.ts`
- **Tests:** `src/machine/tree/index.spec.ts`
- **Key concepts:** States, events, guards, actions, actors

<state_reference>

**States:**

- `visitNode` - Determine node type via guards
- `resolveBranch` - Load async children (loading/success/failure)
- `renderBranch` - Display options, await selection
- `renderLeaf` - Display leaf label, await finalisation
- `renderValue` - Display answer (final)

**Events:**

- `SELECT_CHILD { childIndex }` - Navigate to child
- `SELECT_ROOT` - Return to root
- `FINALISE` - Show answer and end
- `RETRY` - Retry failed async load

</state_reference>

</task>

<task type="command">

### "I need to add or modify a command"

- **CLI entry:** `src/bin.ts`
- **Interactive command:** `src/interactive.ts`
- **Markdown command:** `src/markdown.ts`
- **Standalone bins:** `src/bin-interactive.ts`, `src/bin-markdown.ts`

<command_pattern>

**Standard command structure:**

```typescript
export const run = async ({ sourcePath }: { sourcePath: string }) => {
  const dataPath = resolve(process.cwd(), sourcePath);
  const fileUrl = pathToFileURL(dataPath).href;
  const source = await tryPanicAsync(() => import(fileUrl), ERROR_MSG);
  const tree = await tryPanicAsync(() => source.getHelpDocument(), ERROR_MSG);
  // Process tree...
};
```

</command_pattern>

</task>

<task type="testing">

### "I need to write tests"

- **Location:** Sibling `.spec.ts` files (e.g., `index.ts` → `index.spec.ts`)
- **Framework:** Vitest
- **XState testing:** Use `createActor`, `waitFor`, `getSnapshot()`

<test_pattern>

**Standard test structure:**

```typescript
describe('feature', () => {
  const createLeaf = (label: string, value: string): Leaf => ({ label, value });
  const createBranch = (label: string, children: Node[]): Branch => ({ label, children });

  it('should do something', () => {
    const rootNode = createLeaf('Root', 'value');
    const actor = createTreeInterpreter(rootNode);
    actor.start();
    expect(actor.getSnapshot().value).toBe('renderLeaf');
  });
});
```

</test_pattern>

</task>

<task type="utilities">

### "I need utility functions"

- **Type guards:** `src/lib/utils.ts` - `isString`, `isArray`, `isFunction`, `get`
- **Markdown rendering:** `src/lib/markdown.ts` - `renderToCli`, `toMarkdownFile`
- **Error handling:** `src/lib/try-panic.ts` - `tryPanic`, `tryPanicAsync`

</task>

</task_navigation>

<core_structures>

## Core Data Structures

<structure name="Node">

### Node (`src/index.ts`)

Union type of all possible nodes in a help document:

```typescript
type Node = Leaf | Branch | AsyncBranch;
```

</structure>

<structure name="TreeContext">

### TreeContext (`src/machine/tree/index.ts`)

XState machine context:

```typescript
interface TreeContext {
  currentNode: Node; // Currently displayed node
  rootNode: Node; // For SELECT_ROOT navigation
  error: Error | null; // Async loading errors
}
```

</structure>

<structure name="TreeActor">

### TreeActor

XState actor instance created from the tree machine:

- `actor.start()` - Begin navigation
- `actor.send({ type, ... })` - Send events
- `actor.getSnapshot()` - Get current state
- `actor.subscribe(callback)` - React to changes

</structure>

</core_structures>

<file_organisation>

## File Organisation Quick Reference

<entry_points>

### Entry Points

- **Main CLI:** `src/bin.ts`
- **Interactive standalone:** `src/bin-interactive.ts`
- **Markdown standalone:** `src/bin-markdown.ts`
- **Public API:** `src/index.ts`

</entry_points>

<core_logic>

### Core Logic

- **State machine:** `src/machine/tree/index.ts`
- **Node type guards:** `src/machine/tree/nodes.ts`
- **Interactive UI:** `src/interactive.ts`
- **Markdown export:** `src/markdown.ts`

</core_logic>

<utilities>

### Utilities

- **Type utilities:** `src/lib/utils.ts`
- **Markdown rendering:** `src/lib/markdown.ts`
- **Error handling:** `src/lib/try-panic.ts`
- **JSON utilities:** `src/lib/json.ts`

</utilities>

<testing>

### Testing

- **Machine tests:** `src/machine/tree/index.spec.ts`
- **Node tests:** `src/machine/tree/nodes.spec.ts`
- **Config:** `vitest.config.ts`

</testing>

</file_organisation>

<common_patterns>

## Common Development Patterns

<pattern type="type_guard">

### Type Guard Pattern

```typescript
export const isLeaf = (value: unknown): value is Leaf =>
  hasLabel(value) && isString(get(value, 'value'));

export const isBranch = (value: unknown): value is Branch =>
  hasLabel(value) && isChildren(children(value));

export const isAsyncBranch = (value: unknown): value is AsyncBranch =>
  hasLabel(value) && isFunction(children(value));
```

</pattern>

<pattern type="state_transition">

### State Transition Testing

```typescript
it('should transition to renderLeaf', () => {
  const rootNode = createLeaf('Leaf', 'value');
  const actor = createTreeInterpreter(rootNode);
  actor.start();
  expect(actor.getSnapshot().value).toBe('renderLeaf');
});

it('should handle async branches', async () => {
  const child = createLeaf('Child', 'value');
  const rootNode = { label: 'Async', children: () => Promise.resolve([child]) };
  const actor = createActor(createTreeMachine(rootNode));
  actor.start();
  await waitFor(actor, (state) => state.matches('renderBranch'));
  expect(actor.getSnapshot().value).toBe('renderBranch');
});
```

</pattern>

<pattern type="event_handling">

### Event Handling

```typescript
// Navigate to child
actor.send({ type: 'SELECT_CHILD', childIndex: 0 });

// Return to root
actor.send({ type: 'SELECT_ROOT' });

// Finalise and show answer
actor.send({ type: 'FINALISE' });

// Retry failed load
actor.send({ type: 'RETRY' });
```

</pattern>

</common_patterns>

<development_workflow>

## Development Workflow

<running_tests>

### Running Tests

```bash
pnpm test                    # Run all tests
pnpm test -- --watch         # Watch mode
pnpm test -- index.spec      # Specific test file
```

</running_tests>

<local_testing>

### Local Testing

```bash
# Build first
pnpm build

# Run interactive command
node dist/bin.js interactive --source ./src/fixtures/rxjs-operator-decision-tree.ts

# Run markdown command
node dist/bin.js markdown --source ./src/fixtures/rxjs-operator-decision-tree.ts
```

</local_testing>

<development_tools>

### Development Tools

```bash
pnpm format     # Format code with Prettier
pnpm build      # TypeScript compilation
```

</development_tools>

</development_workflow>

<conventions>

## Naming Conventions

- **Files:** kebab-case.ts (try-panic.ts)
- **Test files:** `*.spec.ts` (sibling to source)
- **Types/Interfaces:** PascalCase (TreeContext, Leaf)
- **Functions:** camelCase (createTreeInterpreter, isLeaf)
- **Type guards:** `is*` prefix (isLeaf, isBranch, isAsyncBranch)
- **Constants:** SCREAMING_SNAKE_CASE or camelCase depending on scope

</conventions>

<error_handling>

## Error Handling Patterns

- Use `tryPanic` / `tryPanicAsync` for operations that should exit on failure
- XState error states for recoverable async failures (RETRY event)
- Type guards prevent runtime type errors

```typescript
// Exit on failure
const source = await tryPanicAsync(() => import(fileUrl), 'Failed to import');

// Recoverable in state machine
onError: {
  target: 'failure',
  actions: assign({ error: ({ event }) => event.error as Error }),
}
```

</error_handling>

<doc_hierarchy>

## Documentation Hierarchy

```
.cursorrules (AI behavioural rules)
    ↓
.notes/context.md (essential concepts)
    ↓
.notes/index.md (this file - navigation hub)
    ↓
Source code (actual implementation)
```

</doc_hierarchy>

<troubleshooting>

## When You're Stuck

1. **Check this index** - Find the right file for your task
2. **Check `.notes/context.md`** - Understand the mental model
3. **Search existing code** - Use grep to find similar patterns
4. **Look at test examples** - Check `*.spec.ts` files for usage
5. **Trace state machine** - Follow visitNode → render\* transitions

</troubleshooting>

<debugging>

## Debugging Tips

1. **Log state:** `console.log(actor.getSnapshot().value)`
2. **Log context:** `console.log(actor.getSnapshot().context)`
3. **Subscribe to all transitions:** `actor.subscribe(console.log)`
4. **Test in isolation:** Create minimal test case with createTreeInterpreter

</debugging>

<git_workflow>

## Git Workflow

- **`main`** - Latest stable release
- Feature branches for new work
- Conventional commits for changelog generation

</git_workflow>

<additional_resources>

## Additional Resources

- **Example document:** `src/fixtures/rxjs-operator-decision-tree.ts`
- **XState docs:** https://stately.ai/docs/xstate
- **Project rules:** `.cursorrules`

</additional_resources>
