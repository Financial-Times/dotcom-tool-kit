# @dotcom-tool-kit/next-router

Tool Kit plugin to run an application via the [`next-router`](https://github.com/financial-times/next-router) in a local environment (on the `run:local` hook).

## Installation & usage

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/next-router
```

And add it to your repo's `.toolkitrc.yml`:

```yml
plugins:
  - '@dotcom-tool-kit/next-router'
```

## Running an app via next-router

For an app to be loaded via the `next-router` (https://local.ft.com:5050), the app will need to be loaded before the `next-router` plugin. This is done by defining the `run:local` hook to run the application before `NextRouter` task. Here is an example full config to do that:

```yml
plugins:
  - '@dotcom-tool-kit/next-router'
  - '@dotcom-tool-kit/nodemon'
  - '@dotcom-tool-kit/vault'

hooks:
  run:local:
    - Nodemon
    - NextRouter

options:
  '@dotcom-tool-kit/next-router':
    appName: appName # system's `name` field as it appears in next-service-registry
  '@dotcom-tool-kit/vault':
    team: 'next'
    app: '[systemCode]' # corresponding Vault directory name
```

## Options

| Key | Description | Default value | Required |
|-|-|-|-|
| `appName` | the system's `name` field as it appears in [next-service-registry](https://next-registry.ft.com/v2), which is _often different to its `code` value so be sure to check_) | | ✅ |

## Tasks

| Task | Description | Default hooks |
|-|-|-|
| `NextRouter` | Run the application via the `next-router` | `run:local` |
