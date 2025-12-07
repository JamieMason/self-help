# Why markdown folders

**LLM-friendly, GitHub wiki compatible, no build step, lazy loading by default.**

## The decision

Help documents are authored as markdown folders rather than JSON, YAML, or custom formats.

## Benefits

### LLM-friendly

- Standard markdown syntax, widely in training data
- File-per-answer means context is naturally scoped
- Folder structure mirrors decision tree visually
- Easy for LLMs to read, navigate, and modify

### GitHub wiki compatible

- Standard markdown renders on GitHub
- Folder structure works with GitHub's wiki feature
- Version control with meaningful diffs
- Collaborative editing with PRs

### No build step

- Edit markdown, run immediately
- No compilation or transformation required
- Changes visible instantly
- Simpler development workflow

### Lazy loading by default

- Each folder/file is an AsyncBranch/AsyncLeaf
- Only loads content when user navigates to it
- Large wikis stay performant
- Memory efficient for deep trees

## Trade-offs considered

| Alternative        | Pros                | Cons                                        |
| ------------------ | ------------------- | ------------------------------------------- |
| Single JSON file   | Simple to parse     | Large files, no lazy loading, hard to edit  |
| YAML               | Human-readable      | Still monolithic, indentation errors        |
| JavaScript modules | Full control, async | Requires JS knowledge, no GitHub preview    |
| Markdown folders   | All benefits above  | Parsing overhead, folder structure required |

## Structure

```
docs/
├── README.md           # Branch: H1 = label, links = children
├── topic/
│   ├── README.md       # Sub-branch
│   └── answer.md       # Leaf: content = value
└── other.md            # Leaf
```

**Key conventions:**

- `README.md` defines branches (H1 + links)
- `.md` files are leaves (entire content is the answer)
- Link order in `README.md` determines child order
- Folder = lazy-loaded sub-tree

## Source files

- Source adapter: `src/source/markdown.ts`
- Parser: `src/build/parser.ts`
- Types: `src/build/types.ts`

## Read Next

- [Why XState](./why-xstate.md)
- [Why async functions](./why-async-functions.md)
- [Create a wiki](../write-help-docs/wiki-creation.md)
