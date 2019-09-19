# self-help

> Interactive Q&A Guides for Web and the Command Line

[![NPM version](http://img.shields.io/npm/v/self-help.svg?style=flat-square)](https://www.npmjs.com/package/self-help) [![NPM downloads](http://img.shields.io/npm/dm/self-help.svg?style=flat-square)](https://www.npmjs.com/package/self-help) [![Build Status](http://img.shields.io/travis/JamieMason/self-help/master.svg?style=flat-square)](https://travis-ci.org/JamieMason/self-help) [![Maintainability](https://api.codeclimate.com/v1/badges/3b3da47293acc6cdf1e6/maintainability)](https://codeclimate.com/github/JamieMason/self-help/maintainability)

## Table of Contents

-   [🌩 Installation](#-installation)
-   [🕹 Usage](#-usage)
-   [👩🏽‍💻 Writing Documents](#-writing-documents)
-   [🙋🏿‍♂️ Getting Help](#♂️-getting-help)
-   [👀 Other Projects](#-other-projects)
-   [🤓 Author](#-author)

## 🌩 Installation

    npm install --global self-help

## 🕹 Usage

### Interactive CLI

Navigate a Self-Help Document from the Command Line:

    self-help interactive --source ./path/to/help-document.js

#### Example

![screenshot](/static/self-help.gif)

### Generate Markdown

Generate Markdown from a Self-Help Document:

    self-help markdown --source ./path/to/help-document.js

Markdown is written to [stdout](https://www.computerhope.com/jargon/s/stdout.htm) for you to pipe into other Command Line Programs or write to a file.

#### Example

The `self-help` RxJS Operator Decision Tree Example [exported as Markdown](https://github.com/JamieMason/self-help/wiki/RxJS-Operator-Decision-Tree).

## 👩🏽‍💻 Writing Documents

A **Help Document** is a JavaScript Module exporting a `getHelpDocument` method of type `GetHelpDocument`.

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
  label: "Welcome to Milk and Cookies, how can we help?",
  children: [
    {
      label: `I'm Thirsty, and`,
      children: () => http.get("/milks-walkthrough.json")
    },
    {
      label: `I'm Hungry, and`,
      children: [
        {
          label: "I love Cookies, so",
          children: () => http.get("/cookies-walkthrough.json")
        },
        {
          label: `Cookies aren't my thing`,
          value: fs.readFileSync("/GET-OUT.md", "utf8")
        }
      ]
    }
  ]
});
```

### `Node` Types

#### `Branch`

A `Branch` presents multiple options to choose from in the form of its `children` Array. Children can be a combination of other `Branch`, `AsyncBranch` or `Leaf` Nodes.

```js
{
  label: 'I just cloned the project, and',
  children: [...]
}
```

#### `AsyncBranch`

An `AsyncBranch` is the same as a `Branch` except its `children` property is a Function which returns a Promise.

This mechanism allows Help Documents to be combined and linked together, use it to **compose higher-level guides which pull together other Help Documents hosted online** or **break down a large Help Document into smaller files** that can be lazily-loaded at runtime.

```js
{
  label: 'I just cloned the project, and',
  children: () => Promise.resolve([])
}
```

#### `Leaf`

A **Leaf** represents the answer the User has been looking for as they have been navigating a given Help Document. The value can be any String, but is **normally the contents of a Markdown Document** which explains the answer to the User.

```js
{
  label: 'I want to install dependencies',
  value: fs.readFileSync('/installation.md', 'utf8')
}
```

## 🙋🏿‍♂️ Getting Help

Get help with issues by creating a [Bug Report] or discuss ideas by opening a [Feature Request].

[bug report]: https://github.com/JamieMason/self-help/issues/new?template=bug_report.md

[feature request]: https://github.com/JamieMason/self-help/issues/new?template=feature_request.md

## 👀 Other Projects

If you find my Open Source projects useful, please share them ❤️

-   [**eslint-formatter-git-log**](https://github.com/JamieMason/eslint-formatter-git-log)<br>ESLint Formatter featuring Git Author, Date, and Hash
-   [**eslint-plugin-move-files**](https://github.com/JamieMason/eslint-plugin-move-files)<br>Move and rename files while keeping imports up to date
-   [**eslint-plugin-prefer-arrow-functions**](https://github.com/JamieMason/eslint-plugin-prefer-arrow-functions)<br>Convert functions to arrow functions
-   [**ImageOptim-CLI**](https://github.com/JamieMason/ImageOptim-CLI)<br>Automates ImageOptim, ImageAlpha, and JPEGmini for Mac to make batch optimisation of images part of your automated build process.
-   [**Jasmine-Matchers**](https://github.com/JamieMason/Jasmine-Matchers)<br>Write Beautiful Specs with Custom Matchers
-   [**karma-benchmark**](https://github.com/JamieMason/karma-benchmark)<br>Run Benchmark.js over multiple Browsers, with CI compatible output
-   [**syncpack**](https://github.com/JamieMason/syncpack#readme)<br>Manage multiple package.json files, such as in Lerna Monorepos and Yarn Workspaces

## 🤓 Author

<img src="https://www.gravatar.com/avatar/acdf106ce071806278438d8c354adec8?s=100" align="left">

I'm [Jamie Mason] from [Leeds] in England, I began Web Design and Development in 1999 and have been Contracting and offering Consultancy as Fold Left Ltd since 2012. Who I've worked with includes [Sky Sports], [Sky Bet], [Sky Poker], The [Premier League], [William Hill], [Shell], [Betfair], and Football Clubs including [Leeds United], [Spurs], [West Ham], [Arsenal], and more.

<div align="center">

[![Follow JamieMason on GitHub][github badge]][github]      [![Follow fold_left on Twitter][twitter badge]][twitter]

</div>

<!-- images -->

[github badge]: https://img.shields.io/github/followers/JamieMason.svg?style=social&label=Follow

[twitter badge]: https://img.shields.io/twitter/follow/fold_left.svg?style=social&label=Follow

<!-- links -->

[arsenal]: https://www.arsenal.com

[betfair]: https://www.betfair.com

[github]: https://github.com/JamieMason

[jamie mason]: https://www.linkedin.com/in/jamiemasonleeds

[leeds united]: https://www.leedsunited.com/

[leeds]: https://www.instagram.com/visitleeds

[premier league]: https://www.premierleague.com

[shell]: https://www.shell.com

[sky bet]: https://www.skybet.com

[sky poker]: https://www.skypoker.com

[sky sports]: https://www.skysports.com

[spurs]: https://www.tottenhamhotspur.com

[twitter]: https://twitter.com/fold_left

[west ham]: https://www.whufc.com

[william hill]: https://www.williamhill.com
