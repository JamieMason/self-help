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

#### Examples

```bash
# Run an interactive Q&A session
self-help interactive --source ./path/to/help-document.js
```

![screenshot](/static/self-help.gif)

### markdown

Generate Markdown from a Self-Help Document. Markdown is written to stdout for you to pipe into
other Command Line Programs or write to a file.

#### Examples

```bash
# Generate markdown documentation
self-help markdown --source ./path/to/help-document.js
# Write output to a file
self-help markdown --source ./path/to/help-document.js > output.md
```

See the
[RxJS Operator Decision Tree](https://github.com/JamieMason/self-help/wiki/RxJS-Operator-Decision-Tree)
for an example of exported Markdown.

## Writing Documents

A **Help Document** is a JavaScript Module exporting a `getHelpDocument` method of type
`GetHelpDocument`.

```ts
type GetHelpDocument = () => Node | Promise<Node>;
```

It returns a Nested Hierarchy of **Node** Objects which form the **Decision Tree** a User will
navigate.

```ts
type Node = Leaf | Branch | AsyncBranch;
```

### Example

```js
export const getHelpDocument = () => ({
  label: 'Welcome to Milk and Cookies, how can we help?',
  children: [
    {
      label: `I'm Thirsty, and`,
      children: () => http.get('/milks-walkthrough.json'),
    },
    {
      label: `I'm Hungry, and`,
      children: [
        {
          label: 'I love Cookies, so',
          children: () => http.get('/cookies-walkthrough.json'),
        },
        {
          label: `Cookies aren't my thing`,
          value: fs.readFileSync('/GET-OUT.md', 'utf8'),
        },
      ],
    },
  ],
});
```

## Node Types

### Branch

A `Branch` presents multiple options to choose from in the form of its `children` Array. Children
can be a combination of other `Branch`, `AsyncBranch` or `Leaf` Nodes.

```js
{
  label: 'I just cloned the project, and',
  children: [...]
}
```

### AsyncBranch

An `AsyncBranch` is the same as a `Branch` except its `children` property is a Function which
returns a Promise.

This mechanism allows Help Documents to be combined and linked together. Use it to **compose
higher-level guides which pull together other Help Documents hosted online** or **break down a large
Help Document into smaller files** that can be lazily-loaded at runtime.

```js
{
  label: 'I just cloned the project, and',
  children: () => Promise.resolve([])
}
```

### Leaf

A **Leaf** represents the answer the User has been looking for as they have been navigating a given
Help Document. The value can be any String, but is **normally the contents of a Markdown Document**
which explains the answer to the User.

```js
{
  label: 'I want to install dependencies',
  value: fs.readFileSync('/installation.md', 'utf8')
}
```

## Badges

- [![NPM version](http://img.shields.io/npm/v/self-help.svg?style=flat-square)](https://www.npmjs.com/package/self-help)
- [![NPM downloads](http://img.shields.io/npm/dm/self-help.svg?style=flat-square)](https://www.npmjs.com/package/self-help)
