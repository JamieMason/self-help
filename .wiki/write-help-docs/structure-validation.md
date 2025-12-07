# Validate structure

**Run `node dist/bin.js lint --source ./path` to validate markdown folder structure.**

## Basic usage

```bash
# Lint a markdown folder
node dist/bin.js lint --source ./docs

# Lint the .wiki
node dist/bin.js lint --source ./.wiki
```

## What it checks

| Check                         | Description                               |
| ----------------------------- | ----------------------------------------- |
| Root `README.md` exists       | Every wiki needs a root index             |
| H1 heading present            | Each `README.md` must have `# Label`      |
| Links valid                   | All links point to existing files/folders |
| Sub-branches have `README.md` | Folders linked must contain `README.md`   |
| No orphan files               | Files should be linked from parent        |

## Error messages

### Missing `README.md`

```
Error: Missing README.md in ./docs/topic/
```

**Fix:** Create `README.md` with H1 heading and links.

### Missing H1 heading

```
Error: No H1 heading found in ./docs/README.md
```

**Fix:** Add `# Label` as first line.

### Broken link

```
Error: Link target not found: ./missing.md in ./docs/README.md
```

**Fix:** Create the missing file or fix the link path.

### Empty children

```
Error: No links found in ./docs/README.md
```

**Fix:** Add at least one link to children.

## Valid structure example

```
docs/
├── README.md           # Required: H1 + links
├── topic/
│   ├── README.md       # Required: H1 + links
│   └── answer.md       # Linked from topic/README.md
└── other.md            # Linked from README.md
```

### Root `README.md`

```markdown
# Documentation

- [Topic](./topic/)
- [Other](./other.md)
```

### Branch `README.md`

```markdown
# Topic

- [Answer](./answer.md)
```

## Running lint programmatically

```typescript
import { lint } from './lint.js';

const errors = await lint({ sourcePath: './docs' });
if (errors.length > 0) {
  errors.forEach((e) => console.error(e.message));
}
```

## Source files

- Lint command: `src/lint.ts`
- Lint tests: `src/lint.spec.ts`
- Parser: `src/build/parser.ts`

## Read Next

- [Create a wiki](./wiki-creation.md)
- [Markdown not parsing](../fix-an-issue/markdown-not-parsing.md)
