# Change markdown parsing

## Read First

- [How it works](../get-started/core-concepts.md)
- [How to contribute](../get-started/contribution-guidelines.md)

## Read Next

- [Test the parser](../write-tests/parser-tests.md)

---

**Edit `src/build/parser.ts`** to modify how markdown folders are parsed.

## Parser overview

The parser reads `README.md` files and extracts:

- **H1 heading** → Branch label
- **Ordered list of links** → Children (order preserved)

## Modifying the parser

### File locations

- Parser: `src/build/parser.ts`
- Types: `src/build/types.ts`
- Tests: `src/build/parser.spec.ts`

### Key functions

```typescript
// Parse README.md content into structured data
parseIndexContent(content: string): ParsedIndex

// Types
interface ParsedIndex {
  label: string;      // From H1 heading
  links: ParsedLink[]; // From ordered list
}

interface ParsedLink {
  label: string;  // Link text
  href: string;   // Link target (file or folder)
}
```

## Adding a new feature

1. Update types in `src/build/types.ts` if needed
2. Modify parsing logic in `src/build/parser.ts`
3. Update `src/source/markdown.ts` if the change affects tree building
4. Add tests in `src/build/parser.spec.ts`

## Example: Adding metadata support

To extract frontmatter or other metadata:

```typescript
// src/build/parser.ts
export const parseIndexContent = (content: string): ParsedIndex => {
  // Extract frontmatter
  const frontmatter = extractFrontmatter(content);

  // Existing H1 and link parsing
  const label = extractH1(content);
  const links = extractLinks(content);

  return { label, links, metadata: frontmatter };
};
```

## Markdown folder structure

```
docs/
├── README.md           # Branch: H1 = label, links = children
├── branch/
│   ├── README.md       # Sub-branch
│   └── leaf.md         # Leaf: entire content = value
└── other-leaf.md       # Leaf
```

### `README.md` format

```markdown
# Branch Label

- [Child One](./child-one.md)
- [Child Two](./child-two/)
```

- H1 becomes the branch label
- Links determine children order
- Link to `.md` file → Leaf
- Link to folder (with `/`) → Sub-branch (folder must have `README.md`)

## Source adapter

Changes may also require updates to `src/source/markdown.ts`:

- `createMarkdownSource()` — Creates AsyncBranch from folder
- `createLeafNode()` — Creates AsyncLeaf from `.md` file
- `loadChildren()` — Loads branch children lazily

## Validation

The lint command validates markdown folders:

```bash
node dist/bin.js lint --source ./docs
```

Update `src/lint.ts` if adding new validation rules.

## Common mistakes

- ❌ Forgetting to handle edge cases (empty files, missing H1)
- ❌ Breaking existing parsing behaviour
- ❌ Not preserving link order
