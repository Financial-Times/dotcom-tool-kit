# @dotcom-tool-kit/n-test

## Installation

Install `@dotcom-tool-kit/n-test` as a `devDependency` in your app:

```sh
npm install --save-dev @dotcom-tool-kit/n-test
```

Add the plugin to your [Tool Kit configuration](https://github.com/financial-times/dotcom-tool-kit/blob/main/readme.md#configuration):

```yaml
plugins:
	- '@dotcom-tool-kit/n-test'
```

And install this plugin's hooks:

```sh
npx dotcom-tool-kit --install
```

Your code will not be modified as a result of installing this plugin, however you can run `npx dotcom-tool-kit --help` and should see that the `Ntest` task has been applied to the `test:review` hook.

## Exports Hooks

## Exports Tasks

### How did n-gage do this?
TBC