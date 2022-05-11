# `circleci` Tool Kit plugin

This plugin exposes state from the CircleCI environment for other plugins to consume generically. It also manages Tool Kit hooks that are run from CircleCI workflows.

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

This plugin cannot currently automatically install itself to CircleCI configuration, so it will exit, and explain what you need to include in the config.

## Hooks

| Event         | Description                                              | Installed to...                        |
| ------------- | -------------------------------------------------------- | -------------------------------------- |
| `build:ci`    | Compile any assets or code required for your app to run. | `build` job in `.circle/config.yml`    |
| `test:ci`     | Run your app's test suite.                               | `test` job in `.circle/config.yml`     |
| `test:review` | Run your app's E2E tests against a deployed Review App.  | `e2e-test` job in `.circle/config.yml` |

## Options passed into .toolkitrc.yml
- nodeVersion: any valid node version


```.toolkitrc.yml
options:
  '@dotcom-tool-kit/circleci':
    nodeVersion: 16.14
```