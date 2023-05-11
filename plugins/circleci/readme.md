# @dotcom-tool-kit/circleci

This plugin exposes state from the CircleCI environment for other plugins to consume generically. It also manages Tool Kit hooks that are run from CircleCI workflows.

This plugin will be installed as a dependency of the [frontend-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/frontend-app), [backend-heroku-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/backend-heroku-app), [component](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/component), [circleci-deploy](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/circleci-deploy), and [circleci-npm](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/circleci-npm) plugins so you do not need to install it separately if you are using any of those plugins.

## Installation

Install `@dotcom-tool-kit/circleci` as a `devDependency` in your app:

```sh
npm install --save-dev @dotcom-tool-kit/circleci
```

Add the plugin to your [Tool Kit configuration](https://github.com/financial-times/dotcom-tool-kit/blob/main/readme.md#configuration):

```yaml
plugins:
	- '@dotcom-tool-kit/circleci'
```

And install this plugin's hooks:

```sh
npx dotcom-tool-kit --install
```

## Options

| Key           | Description                             | Default value |
| ------------- | --------------------------------------- | ------------- |
| `nodeVersion` | the node versioned docker image tag for circleci to use. For example `18.16-browsers` or `16.14`. Can be an array of versions to create a matrix pipeline. The first version in the list is what will be used for publishing etc. | `16.14-browsers` |

## Hooks

| Event         | Description                                              | Installed to...                        | Default Hooks                          |
| ------------- | -------------------------------------------------------- | -------------------------------------- | -------------------------------------- | --------------------------- |
| `build:ci`    | Compile any assets or code required for your app to run. | `build` job in `.circle/config.yml`    | `WebpackProduction`, `BabelProduction` |
| `test:ci`     | Run your app's test suite.                               |                                        | `test` job in `.circle/config.yml`     | `Eslint`, `Mocha`, `JestCi` |
| `test:review` | Run your app's E2E tests against a deployed Review App.  | `e2e-test` job in `.circle/config.yml` | `NTest`, `Pa11y`                       |
