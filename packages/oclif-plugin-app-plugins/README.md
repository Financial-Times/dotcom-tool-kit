# oclif-plugin-app-plugins

A [Oclif](https://oclif.io) plugin that loads other [Oclif](https://oclif.io) plugins. This lets apps install the `dotcom-tool-kit` CLI and separate plugins based on their use cases.

## Using from an app

Apps don't use this plugin directly, it'll be installed as part of a CLI. The CLI specifies a prefix, and this plugin will load any plugins you have installed as `devDependencies` that begin with that prefix. For example, with `dotcom-tool-kit`, you might have the following in your app's `package.json`:

```json
{
  "devDependencies": {
    "dotcom-tool-kit": "^1.0.0",
    "@dotcom-tool-kit/eslint": "^1.0.0",
  }
}
```

When `dotcom-tool-kit` is run from this repo, it will load the `@dotcom-tool-kit/eslint` plugin.

## Using in an Oclif CLI

Install `@dotcom-tool-kit/oclif-plugin-app-plugins` as a dependency of your CLI:

```sh
npm install --save @dotcom-tool-kit/oclif-plugin-app-plugins
```

In your `package.json`, add the plugin to `oclif.plugins`. You'll need to specify the prefix to load with the property `oclif.appPlugins.prefix`. Packages in an app's `devDependencies` starting with this prefix will be automatically loaded.

```json
{
  "oclif": {
    "plugins": [
      "@dotcom-tool-kit/oclif-plugin-app-plugins"
    ],
    "appPlugins": {
      "prefix": "@dotcom-tool-kit/"
    }
  }
}
