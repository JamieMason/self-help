# Plan: Developer Wiki Migration

Migrate `.cursorrules` and `.notes` content into `.wiki/` — an activity-focused decision tree for
LLM and developer onboarding.

---

## Goal

Create `.wiki/` usable via `node ./dist/bin.js interactive --source ./.wiki` that guides users
through common development activities with clear, relevant answers.

---

## Design Principles

Applied from `.plans/research/authoring-guidelines.md`:

### Labels Are the Interface

Users construct meaning from labels alone. A brilliant answer behind a confusing label might as well
not exist. Every label must pass the test: **"If I click this, I'll find \_\_\_?"**

### Front-Load Key Words

Users scan the first 2-3 words. Put distinguishing information first.

| ❌ Current                       | ✅ Improved             |
| -------------------------------- | ----------------------- |
| Getting started with the project | Get started             |
| Understanding design decisions   | Why it's built this way |
| Authoring help documents         | Write help docs         |

### Three Mindless Clicks Beat One Thoughtful Click

Prefer more shallow decisions over fewer complex ones. Each selection should be effortless — users
shouldn't pause to think.

### Structure Constraints

| Metric              | Target    | Rationale                        |
| ------------------- | --------- | -------------------------------- |
| Maximum depth       | 3 levels  | Beyond this, users lose patience |
| Children per branch | 3-7       | Fewer = unnecessary nesting      |
| Label length        | 3-6 words | Longer = System 2 processing     |

### Order by Likelihood

First option has disproportionate influence (anchoring effect). Put the most common need first at
each branch.

### Related Articles for Cross-Cutting Content

Use `## Read First` and `## Read Next` sections to link cross-cutting content rather than
duplicating it. When a user reaches a leaf, self-help gathers and renders all related articles
inline.

**Example:** Every leaf in `add-a-feature/` should have:

```markdown
## Read First

- [Core concepts](../get-started/core-concepts.md)
- [Before you code](../get-started/before-you-code.md)
```

This ensures users always receive essential background context without navigating multiple paths.

**Cross-cutting articles** (referenced by many leaves):

- `get-started/core-concepts.md` — Node types, state machine, formats
- `get-started/before-you-code.md` — When to ask, scope boundaries, code quality

See `.plans/related-articles.md` for implementation details.

### Parallel Structure

All siblings must share grammatical form. Don't mix questions with nouns with verbs.

---

## User Personas

### LLM Assistant

- Arrives with a specific task: "add X", "fix Y", "modify Z"
- Needs: Quick orientation, then precise guidance for task
- **Most common path:** Get started → then specific activity

### Human Developer

- Contributing to self-help codebase
- Needs: Same as LLM, possibly more conceptual context
- **Most common path:** Get started → then specific activity

### Content Author

- Writing help documents (markdown wikis) for end users
- Needs: Authoring guidance, validation
- **Most common path:** Write help docs (may skip Get started)

---

## Proposed Structure

```
.wiki/
├── README.md                           # "What do you need?"
│
├── get-started/                        # ACTIVITY: Orientation (most common first)
│   ├── README.md                       # "Where to begin?"
│   ├── two-minute-overview.md          # What self-help does
│   ├── core-concepts.md                # Node types, state machine
│   ├── codebase-map.md                 # File structure
│   ├── local-development.md            # Build, test, run
│   └── contribution-guidelines.md      # When to ask, scope, style
│
├── add-a-feature/                      # ACTIVITY: Implementation
│   ├── README.md                       # "What kind of feature?"
│   ├── cli-command.md                  # New command pattern
│   ├── state-or-transition.md          # XState modification
│   ├── node-type.md                    # Type + guard + validation
│   ├── markdown-format.md              # Parser changes
│   └── modify-a-command.md             # Change interactive/markdown/lint
│
├── fix-an-issue/                       # ACTIVITY: Debugging
│   ├── README.md                       # "What's happening?"
│   ├── state-machine-stuck.md          # Guards, events, transitions
│   ├── markdown-not-parsing.md         # Parser debugging
│   ├── tests-failing.md                # Scientific debugging
│   └── typescript-errors.md            # Common causes + fixes
│
├── write-tests/                        # ACTIVITY: Validation
│   ├── README.md                       # "What are you testing?"
│   ├── state-machine-tests.md          # Actor testing patterns
│   ├── parser-tests.md                 # Parser test examples
│   ├── type-guard-tests.md             # Guard test patterns
│   └── test-data-factories.md          # createLeaf, createBranch
│
├── design-decisions/                   # ACTIVITY: Learning rationale
│   ├── README.md                       # "Which decision?"
│   ├── why-xstate.md                   # State machine rationale
│   ├── why-type-guards.md              # Runtime safety rationale
│   ├── why-async-functions.md          # Lazy loading benefits
│   └── why-markdown-folders.md         # LLM-friendly format
│
└── write-help-docs/                    # ACTIVITY: Content creation
    ├── README.md                       # "What do you want to do?"
    ├── wiki-creation.md                # Folder structure guide
    ├── answer-creation.md              # Leaf creation
    ├── branch-creation.md              # Branch creation
    ├── structure-validation.md         # Lint command
    └── content-design-principles.md    # Research-backed authoring advice
```

### Structure Validation

| Branch              | Children | Depth | Labels Parallel?                                 |
| ------------------- | -------- | ----- | ------------------------------------------------ |
| Root                | 6        | 1     | ✅ All verbs (one noun phrase for "why" content) |
| `get-started/`      | 5        | 2     | ✅ All nouns                                     |
| `add-a-feature/`    | 5        | 2     | ✅ All nouns                                     |
| `fix-an-issue/`     | 4        | 2     | ✅ All nouns                                     |
| `write-tests/`      | 4        | 2     | ✅ All nouns                                     |
| `design-decisions/` | 4        | 2     | ✅ All questions                                 |
| `write-help-docs/`  | 5        | 2     | ✅ All nouns                                     |

**Maximum depth: 2 levels** (root → branch → leaf). Well under the 3-4 limit.

---

## Label Design

### Root Labels (Activity-Oriented)

All verb phrases, ordered by likelihood of use:

1. **Get started** — Most users start here
2. **Add a feature** — Primary development activity
3. **Fix an issue** — Second-most common activity
4. **Write tests** — Follows implementation
5. **Design decisions** — Reference, less frequent (noun phrase acceptable — "why" content, not
   task)
6. **Write help docs** — Content authors (different persona)

### Label Testing Checklist

For each label, verify:

- [ ] Makes sense without parent context
- [ ] Key words in first 2-3 words
- [ ] 3-6 words total
- [ ] User can complete: "If I click this, I'll find \_\_\_"
- [ ] Clearly differentiated from siblings
- [ ] Uses user language (no jargon)

### Proposed Labels Review

| Label                     | Words | Front-loaded? | Self-sufficient? | Info scent? | Pass |
| ------------------------- | ----- | ------------- | ---------------- | ----------- | ---- |
| Get started               | 2     | ✅            | ✅               | ✅          | ✅   |
| Add a feature             | 3     | ✅            | ✅               | ✅          | ✅   |
| Fix an issue              | 3     | ✅            | ✅               | ✅          | ✅   |
| Write tests               | 2     | ✅            | ✅               | ✅          | ✅   |
| Design decisions          | 2     | ✅            | ✅               | ✅          | ✅   |
| Write help docs           | 3     | ✅            | ✅               | ✅          | ✅   |
| Two-minute overview       | 3     | ✅            | ✅               | ✅          | ✅   |
| Core concepts             | 2     | ✅            | ✅               | ✅          | ✅   |
| Codebase map              | 2     | ✅            | ✅               | ✅          | ✅   |
| Local development         | 2     | ✅            | ✅               | ✅          | ✅   |
| Contribution guidelines   | 2     | ✅            | ✅               | ✅          | ✅   |
| CLI command               | 2     | ✅            | ✅               | ✅          | ✅   |
| State or transition       | 3     | ✅            | ✅               | ✅          | ✅   |
| Node type                 | 2     | ✅            | ✅               | ✅          | ✅   |
| Markdown format           | 2     | ✅            | ✅               | ✅          | ✅   |
| Modify a command          | 3     | ✅            | ✅               | ✅          | ✅   |
| State machine stuck       | 3     | ✅            | ✅               | ✅          | ✅   |
| Markdown not parsing      | 3     | ✅            | ✅               | ✅          | ✅   |
| Tests failing             | 2     | ✅            | ✅               | ✅          | ✅   |
| TypeScript errors         | 2     | ✅            | ✅               | ✅          | ✅   |
| State machine tests       | 3     | ✅            | ✅               | ✅          | ✅   |
| Parser tests              | 2     | ✅            | ✅               | ✅          | ✅   |
| Type guard tests          | 3     | ✅            | ✅               | ✅          | ✅   |
| Test data factories       | 3     | ✅            | ✅               | ✅          | ✅   |
| Why XState                | 2     | ✅            | ✅               | ✅          | ✅   |
| Why type guards           | 3     | ✅            | ✅               | ✅          | ✅   |
| Why async functions       | 3     | ✅            | ✅               | ✅          | ✅   |
| Why markdown folders      | 3     | ✅            | ✅               | ✅          | ✅   |
| Wiki creation             | 2     | ✅            | ✅               | ✅          | ✅   |
| Answer creation           | 2     | ✅            | ✅               | ✅          | ✅   |
| Branch creation           | 2     | ✅            | ✅               | ✅          | ✅   |
| Structure validation      | 2     | ✅            | ✅               | ✅          | ✅   |
| Content design principles | 3     | ✅            | ✅               | ✅          | ✅   |

**Labels changed from original plan:**

| Original              | New                       | Reason                                         |
| --------------------- | ------------------------- | ---------------------------------------------- |
| Key abstractions      | Core concepts             | "Abstractions" is jargon                       |
| Run locally           | Local development         | Noun form to match siblings                    |
| Contribution rules    | Contribution guidelines   | Noun form to match siblings                    |
| Understand the design | Design decisions          | Research: avoid "understand, know, learn"      |
| Existing command      | Modify a command          | "Existing" is vague — what will I find?        |
| State machine         | State machine tests       | Too terse — tests for what?                    |
| Parser                | Parser tests              | Too terse                                      |
| Type guards           | Type guard tests          | Too terse                                      |
| Test factories        | Test data factories       | Clarifies purpose; "factories" alone is jargon |
| Create a wiki         | Wiki creation             | Noun form to match siblings                    |
| Add an answer         | Answer creation           | Noun form to match siblings                    |
| Add a branch          | Branch creation           | Noun form to match siblings                    |
| (new)                 | Content design principles | Surfaces research for content authors          |

---

## Content Migration Map

### `.cursorrules` Content

| Source                               | Destination                              |
| ------------------------------------ | ---------------------------------------- |
| Critical Reading                     | `get-started/README.md` (intro text)     |
| **When to Ask vs Proceed**           | `get-started/contribution-guidelines.md` |
| Node Types                           | `get-started/core-concepts.md`           |
| State Machine Pattern                | `get-started/core-concepts.md`           |
| Key Invariants                       | `get-started/core-concepts.md`           |
| Markdown Folder Format               | `get-started/core-concepts.md`           |
| Wrong Patterns                       | `get-started/contribution-guidelines.md` |
| **Communication Style**              | `get-started/contribution-guidelines.md` |
| Functional style, descriptive names  | `add-a-feature/cli-command.md` (example) |
| Grouped imports, named exports       | `add-a-feature/cli-command.md` (example) |
| Type guards, template literals       | `add-a-feature/node-type.md` (example)   |
| TDD Workflow                         | `write-tests/state-machine-tests.md`     |
| **Code Quality**                     | `get-started/contribution-guidelines.md` |
| Testing conventions                  | `write-tests/test-data-factories.md`     |
| File Organisation                    | `get-started/codebase-map.md`            |
| **Import Style**                     | `add-a-feature/cli-command.md` (example) |
| **Documentation (Public Functions)** | `add-a-feature/cli-command.md` (example) |
| **Pre-Implementation Checklist**     | `get-started/contribution-guidelines.md` |
| **Recognising Assumption Mode**      | `get-started/contribution-guidelines.md` |
| Before Making Claims                 | `get-started/contribution-guidelines.md` |
| Before Writing Tests                 | `write-tests/test-data-factories.md`     |
| **Scope Boundaries (Off-Limits)**    | `get-started/contribution-guidelines.md` |
| Design Rationale                     | `design-decisions/` (all leaves)         |
| When stuck                           | `fix-an-issue/tests-failing.md`          |
| Scientific debugging                 | `fix-an-issue/tests-failing.md`          |
| **Quick Reference / Before commit**  | `get-started/contribution-guidelines.md` |
| LLM Contribution to Help Documents   | `write-help-docs/` (all leaves)          |

**Bold** = previously missing from migration map.

### `.notes/` Content

| Source                            | Destination                           |
| --------------------------------- | ------------------------------------- |
| `context.md` > Quick Facts        | `get-started/two-minute-overview.md`  |
| `context.md` > Mental Model       | `get-started/core-concepts.md`        |
| `context.md` > File Structure     | `get-started/codebase-map.md`         |
| `context.md` > Common Tasks       | (see explicit mappings below)         |
| `context.md` > Data Flow          | `get-started/core-concepts.md`        |
| `context.md` > Red Flags          | `fix-an-issue/state-machine-stuck.md` |
| `index.md` > Task Navigation      | Wiki structure itself                 |
| `index.md` > Troubleshooting      | `fix-an-issue/` (all leaves)          |
| `patterns.md`                     | `design-decisions/` (all leaves)      |
| `quick-reference.md` > Node Types | `get-started/core-concepts.md`        |
| `quick-reference.md` > Machine    | `get-started/core-concepts.md`        |
| `quick-reference.md` > Tests      | `write-tests/test-data-factories.md`  |
| `quick-reference.md` > Commands   | `get-started/local-development.md`    |

### Common Tasks → Explicit Destinations

| Task from `.notes/context.md` | Destination                            |
| ----------------------------- | -------------------------------------- |
| Add new CLI command           | `add-a-feature/cli-command.md`         |
| Modify state machine          | `add-a-feature/state-or-transition.md` |
| Add node type                 | `add-a-feature/node-type.md`           |
| Change markdown format        | `add-a-feature/markdown-format.md`     |
| Debug state issues            | `fix-an-issue/state-machine-stuck.md`  |
| Debug parsing issues          | `fix-an-issue/markdown-not-parsing.md` |

### Related Articles Matrix

Which leaves should link to which cross-cutting content:

**Cross-cutting articles (frequently referenced):**

| Article                                  | Purpose                            |
| ---------------------------------------- | ---------------------------------- |
| `get-started/core-concepts.md`           | Node types, state machine, formats |
| `get-started/contribution-guidelines.md` | When to ask, scope, code quality   |
| `get-started/codebase-map.md`            | Where to find things               |

**Read First mappings:**

| Leaf                                   | Read First                                           |
| -------------------------------------- | ---------------------------------------------------- |
| `add-a-feature/cli-command.md`         | core-concepts, contribution-guidelines, codebase-map |
| `add-a-feature/state-or-transition.md` | core-concepts, contribution-guidelines               |
| `add-a-feature/node-type.md`           | core-concepts, contribution-guidelines               |
| `add-a-feature/markdown-format.md`     | core-concepts, contribution-guidelines               |
| `add-a-feature/modify-a-command.md`    | core-concepts, contribution-guidelines, codebase-map |
| `fix-an-issue/state-machine-stuck.md`  | core-concepts                                        |
| `fix-an-issue/markdown-not-parsing.md` | core-concepts                                        |
| `fix-an-issue/tests-failing.md`        | (none — debugging is self-contained)                 |
| `fix-an-issue/typescript-errors.md`    | (none — error-specific)                              |
| `write-tests/state-machine-tests.md`   | core-concepts, contribution-guidelines               |
| `write-tests/parser-tests.md`          | core-concepts                                        |
| `write-tests/type-guard-tests.md`      | core-concepts                                        |
| `write-tests/test-data-factories.md`   | (none — utility reference)                           |
| `write-help-docs/*`                    | (none — content authoring is self-contained)         |
| `design-decisions/*`                   | (none — rationale is self-contained)                 |

**Read Next mappings:**

| Leaf                                   | Read Next                        |
| -------------------------------------- | -------------------------------- |
| `add-a-feature/cli-command.md`         | state-machine-tests              |
| `add-a-feature/state-or-transition.md` | state-machine-tests              |
| `add-a-feature/node-type.md`           | type-guard-tests                 |
| `add-a-feature/markdown-format.md`     | parser-tests                     |
| `add-a-feature/modify-a-command.md`    | (depends on command modified)    |
| `fix-an-issue/*`                       | (none — user found their answer) |
| `write-tests/*`                        | (none — testing is the end goal) |

---

## Leaf Content Guidelines

### Inverted Pyramid Structure

Most important information first. Users shouldn't scroll to find the answer.

```
┌─────────────────────────────────────┐
│  ANSWER: What to do (1-2 sentences) │  ← Users stop here if enough
├─────────────────────────────────────┤
│  HOW: Steps, commands, file paths   │  ← Most users read this far
├─────────────────────────────────────┤
│  WHY: Rationale, edge cases         │  ← Only if curious
├─────────────────────────────────────┤
│  MORE: Related topics, links        │  ← Reference
└─────────────────────────────────────┘
```

### Content Checklist

For each leaf, verify:

- [ ] First sentence answers "What do I do?"
- [ ] File paths included (e.g., "Edit `src/machine/tree/index.ts`")
- [ ] Commands are copy-pasteable
- [ ] Scannable structure (headings, bullets, whitespace)
- [ ] No duplicate content (link instead)
- [ ] Delivers on the label's promise
- [ ] Plain English (no jargon without explanation)
- [ ] `## Read First` links to prerequisite content (core concepts, guidelines)
- [ ] `## Read Next` links to follow-up content (related tasks, testing)

### What to Include

- **Immediate answer** — First sentence
- **File paths** — Exact locations to edit
- **Commands** — Copy-pasteable snippets
- **Minimal examples** — Just enough to illustrate
- **`## Read First`** — Links to prerequisite articles (background, guidelines)
- **`## Read Next`** — Links to follow-up articles (testing, related tasks)

### What to Exclude

- **Happy talk** — "Welcome to..." or "In this section..."
- **Complete API reference** — Use code comments instead
- **Long code dumps** — Gets stale, harder to maintain
- **Generic advice** — Only specifics

---

## Implementation Phases

### Phase 1: Scaffold & Validate Structure

- [ ] Create `.wiki/` folder
- [ ] Create all `README.md` files with H1 + links
- [ ] Create placeholder `.md` files (H1 only)
- [ ] Run `node ./dist/bin.js lint --source ./.wiki`
- [ ] Navigate interactively to verify structure feels natural

**Validation gate:** Structure lint passes, all paths navigable.

### Phase 2: Get Started (Critical Path)

Order by likelihood — users land here first.

- [ ] `two-minute-overview.md` — Project purpose, core flow
- [ ] `core-concepts.md` — Node types, state machine, sources
- [ ] `codebase-map.md` — File structure with purpose annotations
- [ ] `local-development.md` — Build, test, run commands
- [ ] `contribution-guidelines.md` — When to ask, scope boundaries, code quality

**Validation gate:** LLM can orient in <2 minutes reading these.

### Phase 3: Add a Feature (Primary Activity)

- [ ] `cli-command.md` — Full pattern with file locations
- [ ] `state-or-transition.md` — XState modification guide
- [ ] `node-type.md` — Type + guard + tests
- [ ] `markdown-format.md` — Parser modification
- [ ] `modify-a-command.md` — Change interactive/markdown/lint

**Validation gate:** Each leaf enables immediate action.

### Phase 4: Fix an Issue (Second-Most Common)

- [ ] `state-machine-stuck.md` — Guard checklist, event debugging
- [ ] `markdown-not-parsing.md` — Parser debugging steps
- [ ] `tests-failing.md` — Scientific debugging approach
- [ ] `typescript-errors.md` — Common errors + fixes

**Validation gate:** Each symptom leads to actionable debugging steps.

### Phase 5: Write Tests

- [ ] `state-machine-tests.md` — Actor testing patterns
- [ ] `parser-tests.md` — Parser test examples
- [ ] `type-guard-tests.md` — Guard test patterns
- [ ] `test-data-factories.md` — Factory function usage

**Validation gate:** Patterns match existing test files exactly.

### Phase 6: Design Decisions

- [ ] `why-xstate.md` — Rationale + trade-offs
- [ ] `why-type-guards.md` — Rationale + trade-offs
- [ ] `why-async-functions.md` — Lazy loading benefits
- [ ] `why-markdown-folders.md` — LLM-friendly format

**Validation gate:** Each "why" answers a genuine question developers ask.

### Phase 7: Write Help Docs

- [ ] `wiki-creation.md` — Folder structure guide
- [ ] `answer-creation.md` — Leaf creation steps
- [ ] `branch-creation.md` — Branch creation steps
- [ ] `structure-validation.md` — Lint command usage
- [ ] `content-design-principles.md` — Research-backed authoring advice from `.plans/research/`

**Validation gate:** Content author can create valid wiki without other docs.

### Phase 8: Review & Cleanup

- [ ] Test all paths interactively
- [ ] Verify no content duplication across leaves
- [ ] Run label test: show each label out of context, verify predictable
- [ ] Time test: can user find answer in ≤3 selections?
- [ ] Remove `.notes/` folder
- [ ] Update `.cursorrules` to point to wiki

---

## Example Content

### Root `README.md`

```markdown
# What do you need?

- [Get started](./get-started/)
- [Add a feature](./add-a-feature/)
- [Fix an issue](./fix-an-issue/)
- [Write tests](./write-tests/)
- [Design decisions](./design-decisions/)
- [Write help docs](./write-help-docs/)

Select what you need. Use this wiki regularly during development, and consider improving it after
completing tasks or hitting problems.
```

### `get-started/README.md`

```markdown
# Get started

New to self-help? Start with the overview, then read what you need.

- [Two-minute overview](./two-minute-overview.md)
- [Core concepts](./core-concepts.md)
- [Codebase map](./codebase-map.md)
- [Local development](./local-development.md)
- [Contribution guidelines](./contribution-guidelines.md)
```

### `get-started/two-minute-overview.md`

```markdown
# Two-minute overview

Self-help is a CLI that turns markdown folders into interactive Q&A guides.

## How it works

1. Author writes decision tree as markdown folders
2. User runs `self-help interactive --source ./docs`
3. CLI presents choices, user navigates
4. User reaches an answer

## The four node types

| Type        | Has                               | Purpose             |
| ----------- | --------------------------------- | ------------------- |
| Leaf        | `value: string`                   | Terminal answer     |
| AsyncLeaf   | `value: () => Promise<string>`    | Lazy-loaded answer  |
| Branch      | `children: Node[]`                | Question + options  |
| AsyncBranch | `children: () => Promise<Node[]>` | Lazy-loaded options |

## Key insight

Navigation is a state machine. Selections trigger events. Guards check node types. Machine
transitions to render appropriate UI.

## Read Next

- [Core concepts](./core-concepts.md)
- [Codebase map](./codebase-map.md)
```

### `fix-an-issue/state-machine-stuck.md`

````markdown
# State machine stuck

**Check guards first.** Most stuck states come from guards returning false.

## Quick diagnosis

```typescript
// Add to see current state
console.log(actor.getSnapshot().value);
console.log(actor.getSnapshot().context);
```
````

## Common causes

1. **Guard returning false** — Node doesn't match expected type
2. **Wrong event type** — Spelling must match exactly
3. **Missing `.js` extension** — NodeNext requires it in imports
4. **Async not resolving** — Check `fromPromise` actor is invoked

## Debugging steps

1. Log in type guards (`src/machine/tree/nodes.ts`)
2. Log before `actor.send()` calls
3. Verify node has correct structure:
   - Leaf: `label` + `value` (string)
   - AsyncLeaf: `label` + `value` (function)
   - Branch: `label` + `children` (array)
   - AsyncBranch: `label` + `children` (function)

## Source files

- Machine: `src/machine/tree/index.ts`
- Guards: `src/machine/tree/nodes.ts`
- Tests: `src/machine/tree/index.spec.ts`

## Read First

- [Core concepts](../get-started/core-concepts.md)

## Read Next

- [Tests failing](./tests-failing.md)
- [TypeScript errors](./typescript-errors.md)

````

### `add-a-feature/cli-command.md`

```markdown
# CLI command

**Create a new command file, register it in bin.ts, add tests.**

## Steps

1. Create `src/your-command.ts` with command implementation
2. Register in `src/bin.ts` with Commander
3. Add tests in `src/your-command.spec.ts`

## File locations

- Commands: `src/*.ts` (e.g., `src/interactive.ts`, `src/markdown.ts`)
- Entry point: `src/bin.ts`
- Tests: sibling `.spec.ts` files

## Example structure

```typescript
// src/your-command.ts
import { Command } from 'commander';

export const yourCommand = new Command('your-command')
  .description('What it does')
  .option('--source <path>', 'Source path')
  .action(async (options) => {
    // Implementation
  });
```

## Read First

- [Core concepts](../get-started/core-concepts.md)
- [Contribution guidelines](../get-started/contribution-guidelines.md)
- [Codebase map](../get-started/codebase-map.md)

## Read Next

- [State machine tests](../write-tests/state-machine-tests.md)
````

### `get-started/contribution-guidelines.md`

```markdown
# Contribution guidelines

**Ask before proceeding** when intent is unclear, changes are breaking, or you're creating new
files.

## When to ask

- User intent unclear or multiple valid approaches
- Breaking changes or core architecture modifications
- Creating ANY new files not explicitly requested
- Large refactors (ask strategy questions first)
- Architectural decisions: state machine, node types

## When to proceed

- Pattern clearly exists in codebase
- Following established convention
- Non-breaking changes
- Adding tests, fixing obvious bugs

## Scope boundaries

Don't modify without discussion:

- State machine structure
- Node type definitions
- Public API types (breaking)
- Working commands

Don't add/remove:

- Dependencies without discussion
- Tests
- Files unless explicitly requested

## Code quality

- Functions <50 lines, modules 100-300 lines
- Zero TypeScript errors
- No comments by default (only for complex logic)

## Before committing

- ✅ Tests pass (`pnpm test`)
- ✅ Zero TypeScript errors (`pnpm build`)
- ✅ Code formatted (`pnpm format`)
- ✅ Patterns followed
- ✅ Only necessary changes

## Communication style

Signal over noise:

- Extremely concise, fragments over sentences
- Action-oriented: what to DO
- Ground in facts: cite code/docs
- British English: "behaviour", "organised"

## Improving the wiki

After completing tasks or hitting problems:

- Consider what guidance would have helped
- Update or add wiki content to help next time
- Keep answers specific and actionable
```

### `write-help-docs/README.md`

```markdown
# Write help docs

Authoring guidance for creating markdown folder wikis.

- [Wiki creation](./wiki-creation.md)
- [Answer creation](./answer-creation.md)
- [Branch creation](./branch-creation.md)
- [Structure validation](./structure-validation.md)
- [Content design principles](./content-design-principles.md)
```

### `write-help-docs/content-design-principles.md`

```markdown
# Content design principles

**Apply research-backed guidelines to make wikis effective.** These principles come from information
architecture, content design, and cognitive psychology research.

## Labels are the interface

Users construct meaning from labels alone. Every label must pass: "If I click this, I'll find
\_\_\_?"

- Front-load key words (users scan first 2-3 words)
- Use user language, not jargon
- Be specific (vague labels emit no "information scent")
- Keep labels scannable (3-6 words)

## Structure shapes understanding

- Maximum 3-4 levels deep (users lose orientation beyond this)
- 3-7 children per branch (fewer = unnecessary nesting, more = overwhelming)
- Parallel structure at each level (all verbs, all nouns, or all questions)
- Order by likelihood (most common need first)

## Users scan, don't read

- Inverted pyramid: most important information first
- Start with the answer, not background
- Scannable structure: headings, bullets, whitespace
- No happy talk ("Welcome to..." or "In this section...")

## The tree is a conversation

Each branch is a question, each selection an answer. Design for natural dialogue rhythm.

- Three mindless clicks beat one thoughtful click
- Make backtracking effortless
- No dead ends

## Testing

- Tree test: show labels without design, ask users to find things
- Label test: show labels out of context, verify predictable
- Time test: users should find answers in ≤3 selections

## Sources

Full research: `.plans/research/authoring-guidelines.md`
```

---

## Success Criteria

### Structure

- [ ] Lint passes: `node ./dist/bin.js lint --source ./.wiki`
- [ ] Maximum 2 levels deep (root → branch → leaf)
- [ ] 3-7 children per branch
- [ ] All sibling labels share grammatical form

### Labels

- [ ] Every label passes "If I click this, I'll find \_\_\_" test
- [ ] Key words front-loaded (first 2-3 words)
- [ ] 3-6 words per label
- [ ] Labels work out of context (shown without parent)

### Content

- [ ] Every leaf starts with the answer
- [ ] File paths and commands always included
- [ ] No content duplicated across leaves
- [ ] Each leaf enables action, not just informs
- [ ] `## Read First` links added per Related Articles Matrix
- [ ] `## Read Next` links added per Related Articles Matrix

### Navigation

- [ ] User finds answer in ≤3 selections
- [ ] Most common needs appear first at each level
- [ ] No dead ends

### Cleanup

- [ ] `.notes/` folder removed
- [ ] `.cursorrules` updated (see below)

### `.cursorrules` Update

After migration, `.cursorrules` should be minimal:

```markdown
# Self-Help Development

Use the .wiki for guidance:

\`\`\`bash node ./dist/bin.js interactive --source ./.wiki \`\`\`

**Always:**

- Consult the wiki before starting work
- Consider improving wiki content after completing tasks or hitting problems

The wiki contains all project rules, patterns, and guidance.
```

---

## Anti-Patterns to Avoid

From authoring guidelines research:

| Anti-Pattern                   | Why It's Bad                      | Our Mitigation                     |
| ------------------------------ | --------------------------------- | ---------------------------------- |
| Organisation-centred structure | Built around us, not user needs   | Activity-focused branches          |
| Vague labels                   | No information scent              | Specific, predictive labels        |
| Buried keywords                | Users miss while scanning         | Front-load key words               |
| Happy talk                     | Wastes user time                  | Start with the answer              |
| Wall of text                   | Users won't read                  | Scannable structure                |
| Duplicate content              | Confuses, fragments understanding | Single source, use Read First/Next |
| Too deep                       | Users lose orientation            | Max 2 levels                       |
| Mixed organisation schemes     | Breaks mental model               | Consistent structure per level     |
| Missing context                | User lacks background for task    | Read First links to prerequisites  |
| No follow-up guidance          | User unsure what to do next       | Read Next links to related tasks   |

---

## References

- Authoring guidelines: `.plans/research/authoring-guidelines.md`
- Related articles feature: `.plans/related-articles.md`
- Research sources: `.plans/resources.md`
- Individual research notes: `.plans/research/*.md`

```

```
