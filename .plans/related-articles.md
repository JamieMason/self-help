# Plan: Related Articles Feature ✅ COMPLETE

Extend leaf documents to support `## Read First` and `## Read Next` sections that gather and render
related articles inline when a user reaches a final answer.

---

## Problem

Current design guides users to exactly one markdown document. But:

- Cross-cutting concerns (e.g., "Before you code") are relevant to many paths
- Essential background (e.g., "Core concepts") should accompany task-specific guidance
- Users must navigate multiple paths to get complete context
- LLMs especially benefit from receiving all relevant context together

## Solution

Add two optional sections to leaf markdown files:

- `## Read First` — Articles to render _before_ the main content
- `## Read Next` — Articles to render _after_ the main content

When self-help renders a leaf with these sections, it:

1. Parses the links in `## Read First` and `## Read Next`
2. Recursively gathers related articles (with cycle detection)
3. Renders all content in order: Read First → Main → Read Next

---

## Markdown Format

```markdown
# How to add a CLI command

(main content here)

## Read First

- [Core concepts](../get-started/core-concepts.md)
- [Before you code](../get-started/before-you-code.md)

## Read Next

- [Write tests](../write-tests/state-machine-tests.md)
```

**Rendering order:**

1. Core concepts (from Read First)
2. Before you code (from Read First)
3. How to add a CLI command (main article)
4. Write tests (from Read Next)

---

## Recursive Gathering

Related articles may themselves have `## Read First` / `## Read Next` sections.

**Algorithm:**

```
gather(article, visited = Set()):
  if article in visited:
    return []
  visited.add(article)

  result = []

  for link in article.readFirst:
    result.push(...gather(link, visited))

  result.push(article)

  for link in article.readNext:
    result.push(...gather(link, visited))

  return result
```

**Cycle detection:** Track visited paths. Skip already-visited articles.

**No depth limit:** Follow chains until exhausted. Cycle detection prevents infinite loops.

---

## Rendering

### Interactive Command

When user reaches a leaf:

1. Gather all articles (recursive, deduplicated)
2. Render each with clear separator

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 Core concepts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

(content)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 Before you code
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

(content)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 How to add a CLI command (main)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

(content)
```

### Markdown Command

Same gathering, output as single concatenated markdown with H1 separators or horizontal rules.

---

## Implementation

### Phase 1: Parser Changes

Location: `src/build/parser.ts` or new `src/build/related.ts`

- [ ] Parse `## Read First` section from markdown
- [ ] Parse `## Read Next` section from markdown
- [ ] Extract links from each section
- [ ] Return structured data: `{ content, readFirst: string[], readNext: string[] }`

### Phase 2: Gathering Logic

Location: `src/source/markdown.ts` or new `src/gather.ts`

- [ ] Implement recursive gather algorithm
- [ ] Cycle detection with visited Set
- [ ] Resolve relative paths to absolute
- [ ] Return ordered list of articles to render

### Phase 3: Leaf Type Extension

Location: `src/index.ts` (types)

Consider whether Leaf/AsyncLeaf types need to change:

**Option A:** Keep types unchanged, gathering happens at render time

- Leaf value is still a string
- Gathering is a rendering concern, not a type concern
- Simpler, no breaking changes

**Option B:** Extend Leaf to include related articles

- `Leaf { label, value, readFirst?, readNext? }`
- More explicit, but breaking change

**Recommendation:** Option A — gathering at render time.

### Phase 4: Interactive Rendering

Location: `src/interactive.ts`

- [ ] When rendering leaf value, check for related sections
- [ ] If present, gather all articles
- [ ] Render with separators

### Phase 5: Markdown Export

Location: `src/markdown.ts`

- [ ] Same gathering logic
- [ ] Concatenate with markdown separators (horizontal rules)

### Phase 6: Lint Validation

Location: `src/lint.ts`

- [ ] Validate links in `## Read First` / `## Read Next` resolve to existing files
- [ ] Warn on circular dependencies (informational, not error)
- [ ] Warn if referenced article is a branch `README.md` (should only link leaves)

---

## Edge Cases

| Case                            | Behaviour                                                  |
| ------------------------------- | ---------------------------------------------------------- |
| Circular dependency             | Skip already-visited articles                              |
| Missing linked file             | Lint error; runtime: skip with warning                     |
| Link to `README.md`             | Lint warning; runtime: skip (branches aren't leaf content) |
| Empty Read First/Next           | Treat as no related articles                               |
| Nested related articles         | Recursively gather (depth unlimited)                       |
| Same article in multiple chains | Render once, first occurrence wins                         |

---

## Example: Dev Wiki Usage

`add-a-feature/cli-command.md`:

```markdown
# CLI command

Add a new command to self-help.

## Steps

1. Create command file in `src/`
2. Register in `src/bin.ts`
3. Add tests

(detailed content)

## Read First

- [Core concepts](../get-started/core-concepts.md)
- [Before you code](../get-started/before-you-code.md)

## Read Next

- [State machine tests](../write-tests/state-machine-tests.md)
```

**Result when user navigates to "CLI command":**

1. Core concepts (background)
2. Before you code (guidelines)
3. CLI command (main answer)
4. State machine tests (follow-up)

---

## Testing Strategy

### Unit Tests

- [ ] Parser extracts Read First/Next links correctly
- [ ] Gather algorithm returns correct order
- [ ] Cycle detection prevents infinite loops
- [ ] Missing files handled gracefully

### Integration Tests

- [ ] Interactive command renders gathered articles
- [ ] Markdown command exports gathered articles
- [ ] Lint catches broken links in related sections

### Test Fixtures

Create `test-wiki/` structure with:

- Article A → Read First: B, Read Next: C
- Article B → Read First: D
- Article C → Read Next: A (circular)
- Article D (no related)

Expected gather order for A: D, B, A, C

---

## Success Criteria

- [x] `## Read First` and `## Read Next` parsed from markdown leaves
- [x] Recursive gathering with cycle detection works
- [x] `interactive` command renders all gathered articles with separators
- [x] `markdown` command exports all gathered articles
- [x] `lint` command validates related article links
- [x] No breaking changes to existing wikis (sections are optional)
- [ ] Dev wiki updated to use related articles for cross-cutting content

---

## Future Considerations

**Not in scope, but worth noting:**

- **Collapsible sections** — In interactive mode, collapse Read First by default
- **Caching** — Cache gathered articles for performance
- **Bidirectional links** — Auto-generate "Referenced by" sections
- **Graph visualisation** — Show article relationship graph

---

## References

- Problem identified during dev wiki planning: `.plans/developer-wiki-migration.md`
- Authoring guidelines: `.plans/research/authoring-guidelines.md`
