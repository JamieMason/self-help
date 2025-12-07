# Codebase map

File structure with purpose annotations.

## Entry points

| File                     | Purpose                          |
| ------------------------ | -------------------------------- |
| `src/bin.ts`             | Main CLI entry (all commands)    |
| `src/bin-interactive.ts` | Standalone interactive command   |
| `src/bin-markdown.ts`    | Standalone markdown command      |
| `src/index.ts`           | Public types (Leaf, Branch, etc) |

## Commands

| File                 | Purpose                             |
| -------------------- | ----------------------------------- |
| `src/interactive.ts` | Interactive navigation with prompts |
| `src/markdown.ts`    | Export tree as markdown document    |
| `src/lint.ts`        | Validate markdown folder structure  |

## State machine

| File                        | Purpose                        |
| --------------------------- | ------------------------------ |
| `src/machine/tree/index.ts` | XState machine definition      |
| `src/machine/tree/nodes.ts` | Type guards (isLeaf, isBranch) |

## Markdown source

| File                     | Purpose                             |
| ------------------------ | ----------------------------------- |
| `src/source/markdown.ts` | Lazy markdown source adapter        |
| `src/source/index.ts`    | Public API (`createMarkdownSource`) |
| `src/build/parser.ts`    | Parse `README.md` (H1 + links)      |
| `src/build/types.ts`     | ParsedIndex, ValidationError types  |

## Utilities

| File                   | Purpose                              |
| ---------------------- | ------------------------------------ |
| `src/lib/utils.ts`     | Type utilities (isString, isArray)   |
| `src/lib/markdown.ts`  | Markdown rendering (marked-terminal) |
| `src/lib/try-panic.ts` | Error handling (exit on failure)     |
| `src/lib/json.ts`      | JSON utilities                       |

## Tests

| File                             | Tests for                 |
| -------------------------------- | ------------------------- |
| `src/machine/tree/index.spec.ts` | State machine transitions |
| `src/machine/tree/nodes.spec.ts` | Type guards               |
| `src/build/parser.spec.ts`       | Index parser              |
| `src/source/markdown.spec.ts`    | Markdown source adapter   |
| `src/lint.spec.ts`               | Lint command              |

## Examples

| Path                                          | Purpose                  |
| --------------------------------------------- | ------------------------ |
| `src/fixtures/rxjs-operator-decision-tree.ts` | Example JS help document |
| `test-wiki/`                                  | Example markdown folder  |

## Common modification targets

- **Add CLI command:** `src/bin.ts` + new `src/your-command.ts`
- **Modify navigation:** `src/machine/tree/index.ts`
- **Add node validation:** `src/machine/tree/nodes.ts`
- **Change markdown parsing:** `src/build/parser.ts`
- **Add utility:** `src/lib/your-utility.ts`
