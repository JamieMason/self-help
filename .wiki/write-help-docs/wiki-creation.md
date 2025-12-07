# Create a wiki

**Create a folder with `README.md` at the root.** That's the minimum for a valid wiki.

## Quick start

```bash
mkdir docs
touch docs/README.md
```

## Root `README.md` structure

```markdown
# Your Wiki Title

- [First Topic](./first-topic.md)
- [Second Topic](./second-topic/)
```

**Rules:**

- H1 heading becomes the root label
- Ordered list of links defines children
- Links to `.md` files → Leaves (answers)
- Links to folders (with `/`) → Sub-branches

## Complete example

```
docs/
├── README.md           # Root branch
├── getting-started.md  # Leaf (answer)
├── features/
│   ├── README.md       # Sub-branch
│   ├── feature-a.md    # Leaf
│   └── feature-b.md    # Leaf
└── faq.md              # Leaf
```

**`docs/README.md`:**

```markdown
# Documentation

- [Getting started](./getting-started.md)
- [Features](./features/)
- [FAQ](./faq.md)
```

**`docs/features/README.md`:**

```markdown
# Features

- [Feature A](./feature-a.md)
- [Feature B](./feature-b.md)
```

## Validation

```bash
# Check structure is valid
node dist/bin.js lint --source ./docs

# Navigate interactively
node dist/bin.js interactive --source ./docs
```

## Common mistakes

- ❌ Missing `README.md` in branch folders
- ❌ No H1 heading in `README.md`
- ❌ Links pointing to non-existent files
- ❌ Folder links without trailing `/`

## Naming conventions

| Element | Convention    | Example             |
| ------- | ------------- | ------------------- |
| Folders | kebab-case    | `getting-started/`  |
| Files   | kebab-case.md | `quick-start.md`    |
| Labels  | Title case    | `# Getting Started` |

## File structure tips

- Keep tree shallow (max 3 levels)
- 3–7 children per branch
- Put most common topics first
- Use descriptive file names

## Read Next

- [Create an answer](./answer-creation.md)
- [Create a branch](./branch-creation.md)
- [Validate structure](./structure-validation.md)
