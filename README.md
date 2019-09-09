# self-help

> Interactive Q&A Guides for Web and the Command Line.

[![NPM version](http://img.shields.io/npm/v/self-help.svg?style=flat-square)](https://www.npmjs.com/package/self-help)
[![NPM downloads](http://img.shields.io/npm/dm/self-help.svg?style=flat-square)](https://www.npmjs.com/package/self-help)
[![Build Status](http://img.shields.io/travis/JamieMason/self-help/master.svg?style=flat-square)](https://travis-ci.org/JamieMason/self-help)
[![Maintainability](https://api.codeclimate.com/v1/badges/CODE_CLIMATE_HASH/maintainability)](https://codeclimate.com/github/JamieMason/self-help/maintainability)
[![Follow JamieMason on GitHub](https://img.shields.io/github/followers/JamieMason.svg?style=social&label=Follow)](https://github.com/JamieMason)
[![Follow fold_left on Twitter](https://img.shields.io/twitter/follow/fold_left.svg?style=social&label=Follow)](https://twitter.com/fold_left)

## 🌩 Installation

```
npm install --global self-help
```

## 🕹 Usage

### Interactive CLI

Navigate a Self-Help Document from the Command Line:

```
self-help interactive --source ./path/to/help-document.js
```

#### Example

![screenshot](/static/self-help.gif)

### Generate Markdown

Generate Markdown from a Self-Help Document:

```
self-help markdown --source ./path/to/help-document.js
```

Markdown is written to [stdout](https://www.computerhope.com/jargon/s/stdout.htm) for you to pipe
into other Command Line Programs or write to a file.

## 👩🏽‍💻 Writing Documents

A **Help Document** is a JavaScript Module exporting a `getHelpDocument` method of type
`GetHelpDocument`.

```ts
type GetHelpDocument = () => Node | Promise<Node>;
```

It returns a Nested Hierarchy of **Node** Objects.

```ts
type Node = Leaf | Branch | AsyncBranch;
```

Which form the **Decision Tree** a User will navigate.

```ts
export const getHelpDocument = (): Node => ({
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

### `Node` Types

#### `Branch`

A `Branch` presents multiple options to choose from in the form of its `children` Array. Children
can be a combination of other `Branch`, `AsyncBranch` or `Leaf` Nodes.

```js
{
  label: 'I just cloned the project, and',
  children: [...]
}
```

#### `AsyncBranch`

An `AsyncBranch` is the same as a `Branch` except its `children` property is a Function which
returns a Promise.

This mechanism allows Help Documents to be combined and linked together, use it to **compose
higher-level guides which pull together other Help Documents hosted online** or **break down a large
Help Document into smaller files** that can be lazily-loaded at runtime.

```js
{
  label: 'I just cloned the project, and',
  children: () => Promise.resolve([])
}
```

#### `Leaf`

A **Leaf** represents the answer the User has been looking for as they have been navigating a given
Help Document. The value can be any String, but is **normally the contents of a Markdown Document**
which explains the answer to the User.

```js
{
  label: 'I want to install dependencies',
  value: fs.readFileSync('/installation.md', 'utf8')
}
```

## 🙋🏾‍♀️ Getting Help

- Get help with issues by creating a
  [Bug Report](https://github.com/JamieMason/self-help/issues/new?template=bug_report.md).
- Discuss ideas by opening a
  [Feature Request](https://github.com/JamieMason/self-help/issues/new?template=feature_request.md).
