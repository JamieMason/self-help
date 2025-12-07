# Markdown not parsing

## Read First

- [How it works](../get-started/core-concepts.md)

## Read Next

- [Tests failing](./tests-failing.md)
- [Test the parser](../write-tests/parser-tests.md)

---

**Check `README.md` structure first.** Most parsing issues come from malformed index files.

## Quick diagnosis

```bash
# Lint to see validation errors
node dist/bin.js lint --source ./your-docs

# Check if README.md exists at root
ls ./your-docs/README.md
```

## Common causes

1. **Missing `README.md`** — Every branch folder needs one
2. **No H1 heading** — First line must be `# Label`
3. **Malformed links** — Must be `- [Label](./path)`
4. **Wrong link targets** — Folder links need trailing `/`
5. **Missing linked files** — Links point to non-existent files

## Correct `README.md` format

```markdown
# Branch Label

- [Leaf Link](./leaf.md)
- [Sub-branch Link](./subfolder/)
```

**Rules:**

- H1 heading becomes branch label
- Ordered list of markdown links
- `.md` files → Leaves
- Folders (with `/`) → Sub-branches

## Debugging steps

1. Run lint: `node dist/bin.js lint --source ./path`
2. Check reported errors
3. Verify each `README.md` has H1
4. Verify each link target exists
5. Check file extensions (`.md`)

## Adding logging

```typescript
// In src/build/parser.ts
console.log('Parsing content:', content);
console.log('Extracted label:', label);
console.log('Extracted links:', links);
```

## Source files

- Parser: `src/build/parser.ts`
- Types: `src/build/types.ts`
- Source adapter: `src/source/markdown.ts`
- Lint command: `src/lint.ts`

## Example valid structure

```
docs/
├── README.md           # Required: root branch
├── topic/
│   ├── README.md       # Required: sub-branch
│   └── answer.md       # Leaf content
└── other.md            # Leaf content
```
