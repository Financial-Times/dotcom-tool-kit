# @dotcom-tool-kit/npm

This plugin is for managing Tool Kit hooks that are run from npm scripts (such as `npm run test`).

## Installation

This plugin is included by default in the frontend-app[link] and backend-app[link] plugin setup. If you are installing tool-kit for the first time then the migration tool[link] can be used to install and configure the frontend-app or backend-app plugins.

Or, to install the plugin manually:

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

## Exports Hooks

| Hook | Description | Installed to...|
|-|-|-|
| `build:local` | Compile any assets or code required for your app to run locally, in development. | `build` script in `package.json` (i.e. run from `npm run build`) |
| `test:local` | Run your app's test suite locally, during development. | `test` script in `package.json` (i.e. run from `npm run test`)

## Exports Tasks

| Task | Description | Preconfigured hooks |
|-|-|-|
| `NpmPrune` | Runs the [`npm prune` command](https://docs.npmjs.com/cli/v8/commands/npm-prune) to remove packages specified in devDependencies from the production code | `cleanup:remote` in the Heroku plugin |
| `NpmPublish` | Publishes the code as a package to npm  | `publish:tag` in the CircleCi plugin |

### How did n-gage do this?
TBC