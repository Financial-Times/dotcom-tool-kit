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

## Options

| Key | Description | Default value | Required |
|-|-|-|-|
| `appName` | system code for the application (same as its "name" field in next-service-registry) | | ✅ |

## Tasks

| Task | Description | Default hooks |
|-|-|-|
| `NextRouter` | Run the application via the `next-router` | `run:local` |
