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

### Running an app via next-router

For an app to be loaded via the `next-router` (https://local.ft.com:5050), the app will need to be loaded before the `next-router` plugin. Here is an example config to do that:

```yml
plugins:
  - '@dotcom-tool-kit/next-router'
  - '@dotcom-tool-kit/nodemon'

hooks:
  run:local:
    - Nodemon
    - NextRouter

options:
  '@dotcom-tool-kit/next-router':
    appName: next-[appName]
  '@dotcom-tool-kit/vault':
    team: 'next'
    app: 'next-[appName]'
```

## Options

| Key | Description | Default value | Required |
|-|-|-|-|
| `appName` | system code for the application (same as its "name" field in next-service-registry) | | ✅ |

## Tasks

| Task | Description | Default hooks |
|-|-|-|
| `NextRouter` | Run the application via the `next-router` | `run:local` |
