# `circleci-npm` Tool Kit plugin

This plugin is for managing the `publish:tag` hook that is run from circleci to publish the built package to the npm registry.

## Installation

Install `@dotcom-tool-kit/circleci-npm` as a `devDependency` in your app:

```sh
npm install --save-dev @dotcom-tool-kit/circleci-npm
```

Add the plugin to your [Tool Kit configuration](https://github.com/financial-times/dotcom-tool-kit/blob/main/readme.md#configuration):

```yaml
plugins:
	- '@dotcom-tool-kit/circleci-npm'
```

And install this plugin's hooks:

```sh
npx dotcom-tool-kit --install
```

This will add the tool-kit/publish job to your `config.yml`.

## Hooks

| Event | Description | Installed to...|
|-|-|-|
| `publish:tag` | Publishes the built package to the npm registry | `publish` job in `.circle/config.yml`  |

