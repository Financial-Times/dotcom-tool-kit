# @dotcom-tool-kit/node

Run your Node application.

This plugin will be installed as a dependency of the [frontend-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/frontend-app), [backend-heroku-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/backend-heroku-app) plugins so you do not need to install it separately if you are using either of those plugins.

## Installation

Install `@dotcom-tool-kit/node` as a `devDependency` in your app:

```sh
npm install --save-dev @dotcom-tool-kit/node
```

Add the plugin to your [Tool Kit configuration](https://github.com/financial-times/dotcom-tool-kit/blob/main/readme.md#configuration):

```yaml
plugins:
  - '@dotcom-tool-kit/node'
```

## Options

| Key | Description | Default value |
|-|-|-|
| `entry` | path to the node application | `'./server/app.js'` |
| `useVault` | option to run the application with environment variables from Vault | `true` |
| `ports` | ports to try to bind to for this application | `[3001, 3002, 3003]` |

## Tasks

| Task | Description | Default hooks |
|-|-|-|
| `Node` | Run node application | `run:local` |
