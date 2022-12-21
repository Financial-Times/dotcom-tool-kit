# @dotcom-tool-kit/circleci

This plugin exposes state from the CircleCI environment for other plugins to consume generically. It also manages Tool Kit hooks that are run from CircleCI workflows.

This plugin will be installed as a dependency of the [frontend-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/frontend-app), [backend-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/backend-app), [component](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/component), [circleci-heroku](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/circleci-heroku), and [circleci-npm](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/circleci-npm) plugins so you do not need to install it separately if you are using any of those plugins.

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

## Hooks

| Event         | Description                                              | Installed to...                        | Default Hooks |
| ------------- | -------------------------------------------------------- | ---------------------- | -------------- |
| `build:ci`    | Compile any assets or code required for your app to run. |`build` job in `.circle/config.yml`    | `WebpackProduction`, `BabelProduction` |
| `test:ci`     | Run your app's test suite.   |                            | `test` job in `.circle/config.yml`     | `Eslint`, `Mocha`, `JestCi` |
| `test:review` | Run your app's E2E tests against a deployed Review App.  | `e2e-test` job in `.circle/config.yml` | `NTest`, `Pa11y` |
