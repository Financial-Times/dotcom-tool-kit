# @dotcom-tool-kit/heroku

This plugin handles deploying apps to Heroku. It also manages Tool Kit hooks that are run during Heroku builds.

## Installation

Install `@dotcom-tool-kit/heroku` as a `devDependency` in your app:

```sh
npm install --save-dev @dotcom-tool-kit/heroku
```

Add the plugin to your [Tool Kit configuration](https://github.com/financial-times/dotcom-tool-kit/blob/main/readme.md#configuration):

```yaml
plugins:
	- '@dotcom-tool-kit/heroku'
```

And install this plugin's hooks:

```sh
npx dotcom-tool-kit --install
```

This plugin cannot currently automatically install itself to heroku configuration, so it will exit, and explain what you need to include in the config.

## Deployment workflow

TODO

## Hooks

| Event | Description | Installed to... |
|-|-|-|
| `build:remote` | Compile any assets or code required for your app to run. | `heroku-postbuild` script in `package.json` |
| `release:remote` | Run any post-release tasks for an app that require a tool-kit task, e.g. upload assets to s3 | `heroku-postbuild` script in `package.json` |
