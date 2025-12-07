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

## Source formats

**Markdown folders** (recommended):

```
docs/
├── README.md           # Branch (H1 = label, links = children)
├── topic/
│   ├── README.md       # Sub-branch
│   └── answer.md       # Leaf (content = value)
└── other-answer.md     # Leaf
```

**JavaScript modules** (advanced): Export `getHelpDocument()` returning a Node tree.

## Read Next

- [How it works](./core-concepts.md)
- [Codebase map](./codebase-map.md)
