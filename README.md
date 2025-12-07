# self-help

<p align="center">
  <img src="/static/logo.svg" width="134" height="120" alt="">
  <br>Interactive Q&A Guides for Web and the Command Line.
  <br>Create decision trees that users and LLMs can navigate to find answers.
</p>

## Installation

```bash
npm install --global self-help
```

## Commands

### interactive

Navigate a Self-Help Document from the Command Line interactively.

```bash
# Run from a markdown folder
self-help interactive --source ./docs

# Run from a JavaScript module
self-help interactive --source ./path/to/help-document.js
```

![screenshot](/static/self-help.gif)

### markdown

Generate Markdown from a Self-Help Document. Output is written to stdout.

```bash
# Generate from a markdown folder
self-help markdown --source ./docs

# Generate from a JavaScript module
self-help markdown --source ./path/to/help-document.js

# Write output to a file
self-help markdown --source ./docs > output.md
```

See the
[RxJS Operator Decision Tree](https://github.com/JamieMason/self-help/wiki/RxJS-Operator-Decision-Tree)
for an example of exported Markdown.

### lint

Validate a markdown source directory. Useful for CI and pre-commit hooks.

```bash
self-help lint --source ./docs
```

Reports all validation errors and exits with non-zero code if any are found.

## Writing Documents

Self-Help supports two formats: **Markdown Folders** (recommended) and **JavaScript Modules**.

### Markdown Folders

The recommended format for authoring Help Documents. Easy for humans and LLMs to read, navigate, and
edit. Works as interlinked wiki pages on GitHub.

#### Folder Structure

```
docs/
├── README.md                    # Root branch
├── getting-started/             # Child branch (folder)
│   ├── README.md               # Branch definition
│   ├── installation.md         # Leaf (answer)
│   └── configuration.md        # Leaf (answer)
└── troubleshooting/
    ├── README.md
    └── common-errors.md
```

#### Branch Files (`README.md`)

Each folder represents a branch. The `README.md` file defines:

1. **H1 heading** — the branch label (question/prompt shown to user)
2. **Markdown list of links** — the child options (order matters)

```markdown
# How can we help?

- [Getting started](./getting-started/)
- [Troubleshooting](./troubleshooting/)
- [API Reference](./api-reference.md)
```

#### Link Targets

Links in `README.md` can point to:

| Target            | Type   | Example                       |
| ----------------- | ------ | ----------------------------- |
| Folder            | Branch | `[Label](./folder/)`          |
| Folder (no slash) | Branch | `[Label](./folder)`           |
| Explicit index    | Branch | `[Label](./folder/README.md)` |
| Markdown file     | Leaf   | `[Label](./answer.md)`        |

#### Leaf Files

Leaf files are plain Markdown — no special structure required. The content is displayed when the
user reaches that answer.

```markdown
# Installation

Run the following command to install:

\`\`\`bash npm install --global self-help \`\`\`

## Requirements

- Node.js 18 or later
```

The leaf's **label** comes from the link text in the parent's `README.md`, not from the file itself.

#### Example

**`docs/README.md`:**

```markdown
# Welcome! How can we help?

- [I want to install the project](./installation.md)
- [I'm having an issue](./troubleshooting/)
```

**`docs/installation.md`:**

```markdown
# Installation Guide

Run `npm install` to get started.
```

**`docs/troubleshooting/README.md`:**

```markdown
# What kind of issue?

- [Build errors](./build-errors.md)
- [Runtime errors](./runtime-errors.md)
```

### JavaScript Modules

For programmatic control, you can write a JavaScript module that exports a `getHelpDocument`
function.

```ts
type GetHelpDocument = () => Node | Promise<Node>;
type Node = Leaf | AsyncLeaf | Branch | AsyncBranch;
```

#### Example

```js
export const getHelpDocument = () => ({
  label: 'Welcome! How can we help?',
  children: [
    {
      label: 'I want to install the project',
      value: fs.readFileSync('./installation.md', 'utf8'),
    },
    {
      label: "I'm having an issue",
      children: () => import('./troubleshooting.js').then((m) => m.children),
    },
  ],
});
```

#### Node Types

**Branch** — presents multiple options:

```js
{
  label: 'Choose an option',
  children: [/* Node[] */]
}
```

**AsyncBranch** — lazy-loaded children:

```js
{
  label: 'Choose an option',
  children: () => Promise.resolve([/* Node[] */])
}
```

**Leaf** — the final answer:

```js
{
  label: 'Installation guide',
  value: '# How to install\n\nRun `npm install`'
}
```

**AsyncLeaf** — lazy-loaded content:

```js
{
  label: 'Installation guide',
  value: () => fs.readFileSync('./install.md', 'utf8')
}
```

## LLM Contribution Workflow

The Markdown folder format is designed for LLMs to easily contribute improvements.

### Reading Documents

LLMs can:

- Navigate folders to understand the decision tree structure
- Read `README.md` to see branch questions (H1) and available choices (links)
- Read leaf `.md` files to get answer content

### Contributing

After using a Help Document, LLMs can improve it:

1. **Add new answers** — create a `.md` file and add a link in the parent's `README.md`
2. **Add new branches** — create a folder with `README.md` and add a link in the parent
3. **Edit existing content** — modify the relevant `.md` file directly
4. **Run lint to validate** — `self-help lint --source ./docs`

### Example `.cursorrules` Snippet

```markdown
## Documentation Protocol

Before starting work:

1. Run `self-help interactive --source ./docs`
2. Navigate to find relevant guidance

After completing work, if documentation was missing or unclear:

1. Edit or add markdown files in `docs/`
2. Run `self-help lint --source ./docs` to validate
3. Only edit markdown source files, never generated files
```

## Badges

- [![NPM version](http://img.shields.io/npm/v/self-help.svg?style=flat-square)](https://www.npmjs.com/package/self-help)
- [![NPM downloads](http://img.shields.io/npm/dm/self-help.svg?style=flat-square)](https://www.npmjs.com/package/self-help)
