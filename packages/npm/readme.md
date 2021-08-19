# `npm` Tool Kit plugin

This plugin is for managing Tool Kit hooks that are run from npm scripts (such as `npm run test`).

## Installation

Install `@dotcom-tool-kit/npm` as a `devDependency` in your app:

```sh
npm install --save-dev @dotcom-tool-kit/npm
```

Add the plugin to your [Tool Kit configuration](https://github.com/financial-times/dotcom-tool-kit/blob/main/readme.md#configuration):

```yaml
plugins:
	- '@dotcom-tool-kit/npm'
```

And install this plugin's hooks:

```sh
npx dotcom-tool-kit --install
```

This will modify your `package.json`. You should commit this change.

## Hooks

| Event | Description | Installed to...|
|-|-|-|
| `build:local` | Compile any assets or code required for your app to run locally, in development. | `build` script in `package.json` (i.e. run from `npm run build`) |
| `test:local` | Run your app's test suite locally, during development. | `test` script in `package.json` (i.e. run from `npm run test`)
