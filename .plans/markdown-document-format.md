# Plan: Markdown-Based Help Document Format

## Problem Statement

The current JavaScript decision tree format (`rxjs-operator-decision-tree.ts`) works well for the
state machine but becomes unwieldy when:

- Leaf nodes contain full markdown documents instead of URLs
- LLMs need to navigate and contribute to the tree
- Multiple contributors work on different sections

**Goal:** Design a folder-based markdown structure that:

1. Maps intuitively to the decision tree
2. Is easy for LLMs to read, navigate, and edit
3. Can be used directly as runtime source (no build step)
4. Establishes a feedback loop for continuous improvement
5. Works as interlinked wiki pages on GitHub

---

## Design Decisions

### Decision 1: Folder Structure Mapping

**Choice: Option B** — Slugified folders with labels in H1 headings

Rationale:

- Short paths work better with LLM context windows
- Avoids filesystem issues with long names and special characters
- Labels are explicit in H1 headings and link text (human-readable)
- Link order = child order (explicit, not alphabetical)

### Decision 2: Branch vs Leaf Representation

- **Folders** = Branch nodes (contain children)
- **Markdown files** = Leaf nodes (contain answer content)
- **`README.md`** = Branch metadata (H1 label + links to children)

```
docs/
  README.md              # Root branch: H1 label + links to children
  have-observable/
    README.md            # Branch: H1 label + links to children
    change-value/
      README.md          # Branch: H1 label + links to leaves
      constant.md        # Leaf: pure content (no special structure)
      formula.md         # Leaf: pure content (no special structure)
```

### Decision 3: Branch Files (`README.md`)

Branch files contain:

1. H1 heading = the branch label
2. Markdown list of links defining children (order matters)

```markdown
# I want to change each emitted value

- [to be a constant value](./constant.md)
- [to be a value calculated through a formula](./formula.md)
```

**No frontmatter required.** The H1 heading IS the label.

**Key insight:** The link text IS the child's label. Links can point to:

- `./slug.md` → Leaf node
- `./slug/` → Branch node (resolves to `./slug/README.md`)
- `./slug/README.md` → Branch node (explicit)

### Decision 4: Leaf Content Structure

Leaf files are **pure markdown content** with no special structure:

```markdown
# mapTo

Use `mapTo` when you want to map every emission to the same constant value.

## Usage

\`\`\`typescript source$.pipe(mapTo('constant')) \`\`\`

## When to Use

- Ignoring the source value entirely
- Signalling events without data

## Related Operators

- [map](./formula.md) - Transform with a function
```

No frontmatter, no special structure — just standard markdown. The label comes from the parent's
link text.

### Decision 5: AsyncBranch and AsyncLeaf Support

**All branches load async by default.**

**All leaf values load async by default** — content is read from original markdown files at runtime.

This enables:

- Large documents to be explored lazily rather than loaded upfront
- No content duplication (markdown stays in place as single source of truth)
- No build step required — markdown IS the runtime format
- Changes take effect immediately (re-read each navigation)

### Decision 6: AsyncLeaf Type

**New type required** to support lazy value loading:

```typescript
interface AsyncLeaf {
  label: string;
  value: () => string | Promise<string>;
}
```

This mirrors the existing `AsyncBranch` pattern:

```typescript
interface AsyncBranch {
  label: string;
  children: () => Promise<Node[]>;
}
```

The `Node` union becomes:

```typescript
type Node = Leaf | Branch | AsyncBranch | AsyncLeaf;
```

### Decision 7: GitHub Wiki Compatibility

The markdown files work as interlinked documentation:

- `README.md` files are readable navigation pages with proper H1 headings
- Leaf files are standalone documentation
- Relative links work in GitHub's markdown renderer
- Can be browsed without the CLI tool

---

## Folder Structure Specification

```
<root>/
├── README.md                    # Root branch: H1 label + child links
├── <slug>/                      # Child branch
│   ├── README.md               # Branch: H1 label + child links
│   ├── <slug>.md               # Leaf (pure content)
│   └── <slug>/                 # Nested branch
│       ├── README.md
│       └── ...
└── <slug>/
    └── ...
```

**Naming Rules:**

- Slugs: lowercase, hyphen-separated, alphanumeric only
- Ordering: determined by link order in parent `README.md`
- Special files: `README.md` defines branch structure

**Link Targets:**

- `./slug.md` → Leaf node
- `./slug/` → Branch node (resolves to `README.md`)
- `./slug/README.md` → Branch node (explicit)

---

## Lazy Markdown Source Design

### API

```bash
# Point directly at markdown folder — no build step
node ./dist/bin.js interactive --source ./docs
node ./dist/bin.js markdown --source ./docs
```

### How It Works

1. Detect `--source` is a directory (not a `.js` file)
2. Return an `AsyncBranch` for root where `children()` parses `README.md`
3. Each child link becomes:
   - `AsyncBranch` if target is a folder (children loads that folder's `README.md`)
   - `AsyncLeaf` if target is a `.md` file (value reads file content)
4. Parsing happens lazily as user navigates — only reads what's visited
5. Re-read each time (no caching) — changes take effect immediately

### Example Structure

```
docs/
  README.md          # H1: "How can we help?" + links
  have-observable/
    README.md        # H1: "I have one existing Observable, and" + links
    change-value/
      README.md      # H1: "I want to change each emitted value" + links
      constant.md    # pure content
      formula.md     # pure content
```

### Runtime Behaviour

When user runs `self-help interactive --source ./docs`:

1. Tool reads `docs/README.md`, parses H1 → root label
2. Parses links → returns `AsyncBranch` with lazy `children()`
3. User sees: "How can we help?" with options from links
4. User selects "I have one existing Observable, and"
5. Tool reads `docs/have-observable/README.md`, parses H1 and links
6. Process repeats until user reaches a leaf

**Key insight:** Labels come from:

- H1 heading in `README.md` for the branch itself (when navigating TO a branch)
- Link text in parent `README.md` for children (when displaying options)

### Source Adapter Algorithm

```
function createMarkdownSource(dirPath):
  indexPath = dirPath + "/README.md"
  content = readFile(indexPath)

  h1 = parseFirstH1(content)
  if (!h1):
    throw Error("Missing H1 heading in: " + indexPath)

  links = parseMarkdownLinks(content)

  return {
    label: h1,
    children: () => Promise.resolve(links.map(link => {
      target = resolve(dirPath, link.href)

      if (isDirectory(target)):
        # Branch: return AsyncBranch with lazy children
        return {
          label: link.text,
          children: () => createMarkdownSource(target).children()
        }
      else if (isMarkdownFile(target)):
        # Leaf: return AsyncLeaf with lazy value
        return {
          label: link.text,
          value: () => readFile(target)
        }
      else:
        throw Error("Invalid link target: " + link.href)
    }))
  }
```

### Runtime Validation

Validation happens at runtime as user navigates:

- Missing `README.md` in linked folder → Error when that branch is selected
- Missing H1 heading in `README.md` → Error when that branch is selected
- Broken link (target doesn't exist) → Error when parent is loaded
- Empty leaf file → Allowed (shows empty content)

For upfront validation, use the `lint` command (see Phase 3).

---

## LLM Feedback Loop Design

### The Problem

LLMs use self-help documents but have no mechanism to improve them.

### Solution: Contribution Protocol

**1. Folder Structure is the API**

LLMs can:

- Navigate folders to understand the decision tree
- Read `README.md` to see branch questions (H1) and available choices (links)
- Read leaf `.md` files to get answer content
- Add new branches (create folder + `README.md` with H1 + add link in parent)
- Add new leaves (create `.md` file + add link in parent)
- Edit existing content directly

**2. .cursorrules Integration**

```markdown
<!-- In target project's .cursorrules -->

## Documentation Protocol

Before starting work:

1. Run `self-help interactive --source ./docs/index.generated.js`
2. Navigate to find relevant guidance

After completing work:

1. If documentation was missing, add new leaf/branch to `docs/`
2. If documentation was unclear, edit the relevant `.md` file
3. Run `pnpm build:docs` to regenerate (only needed for structural changes)

Contribution guidelines:

- Only edit markdown source files in `docs/`, never `.generated.js`
- Branch files (`README.md`) need H1 heading and child links
- Leaf files are pure markdown (label comes from parent's link text)
- Add new children by adding links to parent's `README.md`
- Content changes don't require rebuild — they're read at runtime
```

**3. Natural Improvement Cycle**

```
LLM uses self-help → finds gap → adds/edits markdown → (rebuild if structural) → better next time
```

The folder structure and markdown links are the contribution mechanism.

---

## Implementation Plan

### Phase 0: AsyncLeaf Type Support ✅ COMPLETE

**Completed:**

1. ✅ Added `AsyncLeaf` interface to `src/index.ts`
2. ✅ Updated `Node` union type to include `AsyncLeaf`
3. ✅ Added `isAsyncLeaf` type guard to `src/machine/tree/nodes.ts`
4. ✅ Updated state machine with `resolveLeaf` state
5. ✅ Tests for new type and transitions (65 tests passing)
6. ✅ Updated `interactive.ts` to handle `resolveLeaf` loading state
7. ✅ Updated `lib/markdown.ts` to handle `AsyncLeaf` nodes

**Files modified:**

```
src/index.ts                    # Added AsyncLeaf type
src/machine/tree/nodes.ts       # Added isAsyncLeaf guard
src/machine/tree/nodes.spec.ts  # Tests for isAsyncLeaf
src/machine/tree/index.ts       # Added resolveLeaf state, getValue actor
src/machine/tree/index.spec.ts  # Tests for AsyncLeaf transitions
src/interactive.ts              # Handle resolveLeaf loading state
src/lib/markdown.ts             # Handle AsyncLeaf in markdown export
```

**State machine changes:**

- New state: `resolveLeaf` (mirrors `resolveBranch`)
- `visitNode` guard for `isAsyncLeaf` → `resolveLeaf`
- `resolveLeaf` invokes `getValue` actor, then → `renderLeaf`
- New context field: `resolvedValue` stores resolved string

### Phase 1: Core Build Infrastructure ✅ COMPLETE (refactored)

**Completed:**

1. ✅ Created `src/build/` module
2. ✅ Implemented H1 heading parser (`parser.ts`)
3. ✅ Implemented markdown link parser (uses `marked` lexer)
4. ✅ Removed walker, generator, build command (replaced by lazy source adapter)

**Files kept:**

```
src/build/
  parser.ts          # H1 + link parsing from README.md
  parser.spec.ts     # Parser unit tests
  types.ts           # ParsedLink, ParsedIndex, ValidationError
```

**Files removed:**

- `src/build/index.ts` — Build public API
- `src/build/index.spec.ts` — Build integration tests
- `src/build/walker.ts` — Tree walker
- `src/build/walker.spec.ts` — Walker tests
- `src/build/generator.ts` — JS module generation
- `src/build-command.ts` — CLI build command

### Phase 2: Lazy Markdown Source Adapter ✅ COMPLETE

**Completed:**

1. ✅ Created `src/source/markdown.ts` — adapter returning `AsyncBranch` from directory
2. ✅ Reuses parser logic for H1 and link extraction
3. ✅ Implements lazy `children()` that parses on demand
4. ✅ Implements lazy `value()` for leaf files
5. ✅ Re-reads each time (no caching)
6. ✅ Updated `interactive` and `markdown` commands to detect directory source
7. ✅ Removed `build` command from CLI
8. ✅ Tests for source adapter (17 tests)

**Files created:**

```
src/source/
  markdown.ts        # Lazy markdown source adapter
  markdown.spec.ts   # Tests
  index.ts           # Public API: createMarkdownSource(path) → AsyncBranch
```

**Implementation details:**

- `createMarkdownSource(dirPath)` returns `AsyncBranch` with label from H1
- `children()` parses `README.md` links and returns `AsyncBranch` or `AsyncLeaf` nodes
- `value()` on leaves reads file content via `readFileSync`
- `MarkdownSourceError` thrown for validation failures at runtime
- CLI auto-detects directory vs JS file based on presence of `README.md`

### Phase 3: Lint Command ✅ COMPLETE

**Completed:**

1. ✅ Added `self-help lint --source <dir>` command
2. ✅ Walk entire tree upfront, collect all validation errors
3. ✅ Report: missing `README.md`, missing H1, broken links, etc.
4. ✅ Exit with non-zero code if errors found
5. ✅ Useful for CI and pre-commit hooks

**Files created:**

```
src/lint.ts          # Lint implementation with lint() and run()
src/lint.spec.ts     # 17 tests for lint command
```

**Implementation details:**

- `lint(sourcePath)` returns `{ success: boolean, errors: ValidationError[] }`
- Walks entire tree eagerly (unlike lazy source adapter)
- Collects all errors without stopping on first error
- Detects circular references to avoid infinite loops
- Reuses parser from `src/build/parser.ts`

### Phase 4: Migration Tooling

**Status:** Not started (optional)

**Tasks:**

1. Create reverse converter (TypeScript → markdown folders)
2. Migrate full `rxjs-operator-decision-tree.ts` as proof of concept

### Phase 5: Documentation ✅ COMPLETE

**Completed:**

1. ✅ Updated README with markdown folder format, all commands, examples
2. ✅ Documented LLM contribution workflow in README
3. ✅ Added `.cursorrules` section for LLM contribution to help documents
4. ✅ Updated `.notes/context.md` with AsyncLeaf and markdown source info
5. ✅ Updated `.notes/index.md` with new files and patterns

**Files updated:**

- `README.md` — Full documentation of markdown folder format, commands, LLM workflow
- `.cursorrules` — Added markdown format section and LLM contribution commands
- `.notes/context.md` — Updated with AsyncLeaf type and markdown source flow
- `.notes/index.md` — Updated file structure, commands, patterns

---

## Resolved Questions

| Question                 | Answer                                          |
| ------------------------ | ----------------------------------------------- |
| Build output in git?     | Gitignore for now                               |
| Large leaf documents?    | No special treatment, use standard markdown     |
| Multiple output formats? | JS only for now                                 |
| Validation strictness?   | Strict — errors only, no warnings               |
| XML tags for structure?  | No — plain markdown only                        |
| Async loading?           | Always async for all branches AND leaf values   |
| Content embedding?       | No — lazy file reads at runtime, no duplication |
| Where do labels live?    | H1 in `README.md`, link text for children       |
| Leaf frontmatter?        | None — leaves are pure markdown content         |
| Child ordering?          | Link order in parent `README.md`                |
| Branch label format?     | H1 heading (no frontmatter)                     |

---

## Success Criteria

- [x] `AsyncLeaf` type added and state machine handles it
- [x] Parser extracts H1 headings and links from `README.md`
- [x] Lazy markdown source adapter returns `AsyncBranch`/`AsyncLeaf` from directory
- [x] `interactive --source ./dir` works with markdown folders directly
- [x] `markdown --source ./dir` works with markdown folders directly
- [x] No build step required — markdown IS the runtime format
- [x] Re-reads files each navigation (no caching)
- [x] `lint` command validates entire tree upfront
- [x] LLM can navigate folder structure intuitively
- [x] Markdown files work as GitHub wiki pages
- [x] LLM contribution workflow documented
- [ ] RxJS example fully migrated (optional)

---

## Example: Full Migration

**Before (TypeScript):**

```typescript
{
  label: 'I want to change each emitted value',
  children: [
    {
      label: 'to be a constant value',
      value: 'https://rxjs.dev/api/operators/mapTo',
    },
    {
      label: 'to be a value calculated through a formula',
      value: 'https://rxjs.dev/api/operators/map',
    },
  ],
}
```

**After (Markdown folders):**

```
change-value/
  README.md
  constant.md
  formula.md
```

**`README.md` (branch — H1 is the label):**

```markdown
# I want to change each emitted value

- [to be a constant value](./constant.md)
- [to be a value calculated through a formula](./formula.md)
```

**`constant.md` (leaf — pure content, label from parent's link):**

```markdown
# mapTo

Maps every source emission to the specified constant value.

## Usage

\`\`\`typescript import { mapTo } from 'rxjs/operators';

clicks$.pipe(mapTo('clicked!')); \`\`\`

## When to Use

- Converting events to signals
- Replacing values with constants

## Gotchas

- Deprecated in RxJS 8+, use `map(() => value)` instead

## Related

- [map](./formula.md) - Transform with function
```

**Generated (JS):**

```typescript
// change-value/index.generated.js
import { readFileSync } from 'node:fs';

const read = (path) => () => readFileSync(new URL(path, import.meta.url), 'utf8');

export const children = [
  {
    label: 'to be a constant value',
    value: read('./constant.md'),
  },
  {
    label: 'to be a value calculated through a formula',
    value: read('./formula.md'),
  },
];
```

---

## Next Steps

1. ~~Review this plan~~
2. ~~Clarify open questions~~
3. ~~Phase 0: Add `AsyncLeaf` type support~~
4. ~~Phase 1: Core build infrastructure~~ (parser kept, build command removed)
5. ~~Phase 2: Lazy markdown source adapter~~
6. ~~Phase 3: Lint command~~
7. Phase 4: Migration tooling (optional, skipped)
8. ~~Phase 5: Documentation~~

**Completed in Phase 5:**

- Updated `README.md` with markdown folder format documentation
- Added LLM contribution workflow to README
- Updated `.cursorrules` with markdown format and contribution commands
- Updated `.notes/context.md` and `.notes/index.md`

**Quick commands (target API):**

```bash
# Run interactive directly against markdown folder — no build step
node dist/bin.js interactive --source ./test-wiki

# Export to markdown
node dist/bin.js markdown --source ./test-wiki

# Validate entire tree upfront
node dist/bin.js lint --source ./test-wiki
```
