# Self-Help: LLM Context Guide

<purpose>
This file provides essential context for LLM-assisted development sessions on Self-Help.
</purpose>

<project_overview>

## Project Overview

Self-Help is a TypeScript CLI tool for creating and navigating interactive Q&A guides. Users author
decision trees as JavaScript modules, then navigate them interactively in the terminal or export
them as Markdown documentation.

**Current Status:** Version 0.3.x, stable

</project_overview>

<quick_facts>

## Quick Facts

- **Language:** TypeScript (ES2022, NodeNext modules)
- **Domain:** Interactive documentation, decision trees
- **Architecture:** XState state machine driving tree navigation
- **Testing:** Vitest with coverage thresholds
- **Package Manager:** pnpm

</quick_facts>

<core_concept>

## Core Concept

Users create "Help Documents" - JavaScript modules exporting a `getHelpDocument()` function that
returns a tree of Nodes. Each Node is either a question (Branch) or an answer (Leaf). Users navigate
by selecting options until they reach an answer.

</core_concept>

<mental_model>

## Essential Mental Model

```
User runs command → Load JS module → Call getHelpDocument() → Get Node tree
  ↓
XState machine navigates tree based on user selections
  ↓
Render current node (prompt or answer) → Exit or continue
```

**Key insight:** Every Node has a `label` (displayed text). Branches have `children` (more Nodes).
Leaves have `value` (the answer content, typically Markdown).

</mental_model>

<critical_types>

## The Three Critical Types

### 1. Node (union of all node types)

```typescript
type Node = Leaf | Branch | AsyncBranch;
```

### 2. Leaf (terminal node with answer)

```typescript
interface Leaf {
  label: string; // Displayed as final choice
  value: string; // Answer content (usually Markdown)
}
```

### 3. Branch (node with children)

```typescript
interface Branch {
  label: string; // Question/prompt text
  children: Node[]; // Available choices
}

interface AsyncBranch {
  label: string;
  children: () => Promise<Node[]>; // Lazy-loaded children
}
```

</critical_types>

<state_machine>

## State Machine (XState)

The tree navigation is driven by an XState machine with these states:

```
visitNode (initial)
  ├── [isAsyncBranch] → resolveBranch.loading
  ├── [isBranch] → renderBranch
  └── [isLeaf] → renderLeaf

resolveBranch
  ├── loading → invoke getChildren
  ├── success → visitNode
  └── failure → (await RETRY)

renderBranch
  └── SELECT_CHILD → visitNode

renderLeaf
  ├── FINALISE → renderValue
  └── SELECT_ROOT → visitNode

renderValue (final)
```

### Events

- `SELECT_CHILD { childIndex: number }` - Navigate to child node
- `SELECT_ROOT` - Return to root node
- `FINALISE` - Display leaf value and end
- `RETRY` - Retry failed async load

### Context

```typescript
interface TreeContext {
  currentNode: Node; // Node being processed
  rootNode: Node; // Original root for SELECT_ROOT
  error: Error | null; // Async loading error
}
```

</state_machine>

<file_structure>

## File Structure Quick Map

```
src/
├── index.ts                 - Public types (Leaf, Branch, AsyncBranch, Node)
├── bin.ts                   - CLI entry point (sade)
├── bin-interactive.ts       - Standalone interactive command
├── bin-markdown.ts          - Standalone markdown command
├── interactive.ts           - Interactive command implementation
├── markdown.ts              - Markdown export implementation
│
├── lib/
│   ├── json.ts              - JSON utilities
│   ├── markdown.ts          - Markdown rendering (marked + marked-terminal)
│   ├── try-panic.ts         - Error handling utilities
│   └── utils.ts             - Type guards and utilities (isString, isArray, get)
│
├── machine/
│   └── tree/
│       ├── index.ts         - XState machine definition
│       ├── index.spec.ts    - Machine tests
│       ├── nodes.ts         - Node type guards (isLeaf, isBranch, isAsyncBranch)
│       └── nodes.spec.ts    - Type guard tests
│
└── fixtures/
    └── rxjs-operator-decision-tree.ts  - Example help document
```

</file_structure>

<common_tasks>

## Common Tasks

<task type="adding_command">
Adding a new command → Create `src/my-command.ts`, add to `src/bin.ts`
</task>

<task type="modifying_navigation">
Modifying navigation logic → Edit `src/machine/tree/index.ts`
</task>

<task type="adding_node_type">
Adding node type validation → Edit `src/machine/tree/nodes.ts`
</task>

<task type="testing">
Testing state machine → Use `createActor`, `waitFor` from XState in `*.spec.ts`
</task>

</common_tasks>

<data_flow_example>

## Data Flow Example

User runs: `self-help interactive --source ./guide.js`

<phase name="load">

### 1. Load Phase

- Parse CLI args: source path
- Dynamic import of source file
- Call `getHelpDocument()` to get root Node

</phase>

<phase name="initialise">

### 2. Initialise Phase

- Create XState actor with root Node
- Subscribe to state changes
- Start actor

</phase>

<phase name="navigate">

### 3. Navigate Phase

- Machine transitions through states
- `renderBranch`: Show @clack/prompts select menu
- `SELECT_CHILD`: User picks option, machine transitions
- `renderLeaf`: User reaches answer
- `FINALISE`: Display value, machine reaches final state

</phase>

</data_flow_example>

<testing_philosophy>

## Testing Philosophy

- **State machine tests:** Test transitions and context updates
- **Type guard tests:** Test node type detection
- **Use factories:** `createLeaf()`, `createBranch()` for test data
- **Async testing:** Use `waitFor` from XState for async transitions

<test_example>

```typescript
const rootNode = createLeaf('Root', 'root value');
const actor = createTreeInterpreter(rootNode);
actor.start();
expect(actor.getSnapshot().value).toBe('renderLeaf');
```

</test_example>

</testing_philosophy>

<important_distinctions>

## Important Distinctions

<distinction type="sync_async">

**Branch vs AsyncBranch:**

- Branch: `children` is `Node[]` (immediate)
- AsyncBranch: `children` is `() => Promise<Node[]>` (lazy-loaded)

</distinction>

<distinction type="label_value">

**label vs value:**

- `label`: Displayed during navigation (all nodes)
- `value`: Answer content (Leaf only)

</distinction>

<distinction type="commands">

**interactive vs markdown:**

- interactive: Navigate tree with prompts, display one answer
- markdown: Traverse entire tree, output all paths as Markdown

</distinction>

</important_distinctions>

<dependencies>

## Key Dependencies

- **xstate** - State machine library
- **@clack/prompts** - Beautiful CLI prompts
- **marked** + **marked-terminal** - Markdown rendering
- **sade** - CLI argument parsing
- **tinyrainbow** - Terminal colours

</dependencies>

<common_questions>

## Common Questions

<qa>
<q>Where do I add node validation?</q>
<a>src/machine/tree/nodes.ts - Add type guard function</a>
</qa>

<qa>
<q>How do I test state transitions?</q>
<a>Use createActor, send events, check getSnapshot().value</a>
</qa>

<qa>
<q>Where are commands implemented?</q>
<a>src/interactive.ts, src/markdown.ts - Each exports `run()`</a>
</qa>

<qa>
<q>How do I run locally?</q>
<a>`pnpm build && node dist/bin.js interactive --source ./path/to/doc.js`</a>
</qa>

<qa>
<q>What's the difference between Leaf and Branch?</q>
<a>Leaf has `value` (answer). Branch has `children` (more nodes).</a>
</qa>

</common_questions>

<session_checklist>

## Session Checklist

Before starting work:

- [ ] Understand which command this affects (interactive/markdown)
- [ ] Check if similar code exists (grep/search)
- [ ] Identify which state machine states are relevant
- [ ] Know whether to modify nodes.ts or machine index.ts
- [ ] Have test examples ready (look at existing `.spec.ts` files)

</session_checklist>

<red_flags>

## Red Flags

<warning>🚩 Mutating context directly - USE assign() action</warning> <warning>🚩 Type assertions
without guards - USE isLeaf/isBranch/isAsyncBranch</warning> <warning>🚩 Adding state without
transitions - ENSURE all states are reachable</warning> <warning>🚩 Forgetting .js extension in
imports - REQUIRED for NodeNext</warning> <warning>🚩 Default exports - USE named exports</warning>

</red_flags>

<success_criteria>

## Success Criteria

Code is good when:

<checklist>
✓ Uses XState patterns correctly
✓ Type guards used for node type checks
✓ Tests in sibling .spec.ts file
✓ Follows existing naming conventions
✓ Compiles and passes `pnpm test`
✓ No TypeScript errors
</checklist>

</success_criteria>
