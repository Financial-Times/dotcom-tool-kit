# @dotcom-tool-kit/lint-staged-npm

A plugin to install the [lint-staged](https://github.com/okonet/lint-staged) tool into your package.json using hooks.

## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/lint-staged-npm
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/lint-staged-npm'
```

## Accepting staged files

lint-staged passes the files that you have staged in your git index, filtered by the glob in your lint-staged config, as arguments to the executable you've specified in your config. For example, if you have staged `src/example.js`, `test/example.js`, and `readme.md` in your git index, and you have lint-staged configured to run `prettier --write` for any files matching the `**/*.js` glob, lint-staged will invoke `prettier --write src/example.js test/example.js`. Typically, all command line arguments to `dotcom-tool-kit` will be interpreted as additional hooks to be run, but any arguments after an `--` escape switch will instead be parsed as file paths which are passed as arguments to all tasks associated with the specified hooks. For example, you can invoke multiple hooks by passing them all as arguments, such as `dotcom-tool-kit format:staged test:staged`. lint-staged will pass any staged files as additional arguments, like `dotcom-tool-kit format:staged src/index.js`, but Tool Kit will interpret `src/index.js` as a hook name. Instead we want to call `dotcom-tool-kit format:staged -- src/index.js`, so we include the `--` argument when configuring lint-staged, and any arguments afterwards will be interpreted as file paths and passed as a `files` argument to tasks. Therefore, any tasks that are expected to be used with lint-staged should be able to accept this `files` string array in their `run()` method so that their task can be filtered to only run over files that have been staged in git.

## Options

| Key | Description | Default value |
|-|-|-|
| `testGlob` | the glob for which staged files should be passed to the `test:staged` hook | `'**/*.js'` |
| `formatGlob` | the glob for which staged files should be passed to the `format:staged` hook | `'**/*.js'` |

## Hooks

| Event | Description | Installed to...| Default Tasks
|-|-|-|-|
| `test:staged` | run tests on staged files via git hook  | `lint-staged` config field in `package.json` | `Eslint` |
| `format:staged` | format staged files via git hook  | `lint-staged` config field in `package.json` | `Prettier` |
