# Create a branch

**Create a folder with `README.md`, then add a link in the parent's `README.md`.**

## Steps

1. Create folder for the branch:

```bash
mkdir ./docs/your-branch
```

2. Create `README.md` in the folder:

```markdown
# Your Branch Label

- [First Child](./first-child.md)
- [Second Child](./second-child.md)
- [Sub-branch](./sub-branch/)
```

3. Add link in parent `README.md`:

```markdown
# Parent Label

- [Existing child](./existing.md)
- [Your Branch Label](./your-branch/) <!-- Add this -->
```

## `README.md` structure

```markdown
# Branch Label (H1 heading = label)

Optional intro text here.

- [Child One](./child-one.md)
- [Child Two](./child-two.md)
- [Sub-branch](./subfolder/)
```

**Rules:**

- H1 heading becomes the branch label
- Links define children (order preserved)
- Link to `.md` file → Leaf
- Link to folder (with trailing `/`) → Sub-branch

## Link format

```markdown
- [Display Label](./relative-path)
```

| Target        | Example       | Node type                             |
| ------------- | ------------- | ------------------------------------- |
| Markdown file | `./answer.md` | Leaf                                  |
| Folder        | `./topic/`    | Branch (folder must have `README.md`) |

## Validation

After creating:

```bash
node dist/bin.js lint --source ./docs
```

Check for:

- ✅ `README.md` exists in folder
- ✅ H1 heading present
- ✅ All link targets exist
- ✅ Sub-folders have their own `README.md`

## Example

Create a "Troubleshooting" branch under docs:

```
docs/
├── README.md              # Root (add link here)
└── troubleshooting/
    ├── README.md          # New branch
    ├── common-errors.md   # Leaf
    └── debugging.md       # Leaf
```

**Parent `docs/README.md`:**

```markdown
# Help

- [Getting started](./getting-started.md)
- [Troubleshooting](./troubleshooting/) <!-- Added -->
```

**New `docs/troubleshooting/README.md`:**

```markdown
# Troubleshooting

What's happening?

- [Common errors](./common-errors.md)
- [Debugging](./debugging.md)
```

## Common mistakes

- ❌ Missing `README.md` in folder → folder won't be recognised as branch
- ❌ Missing H1 heading → branch has no label
- ❌ Missing trailing `/` on folder link → treated as file, fails
- ❌ Forgetting to add link in parent → branch unreachable

## Read Next

- [Create an answer](./answer-creation.md)
- [Validate structure](./structure-validation.md)
- [Apply design principles](./content-design-principles.md)
