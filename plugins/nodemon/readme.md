# @dotcom-tool-kit/nodemon

Tool Kit plugin to run an application with [Nodemon](https://nodemon.io).

## Installation & usage

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/nodemon
```

And add it to your repo's `.toolkitrc.yml`:

```yml
plugins:
  - '@dotcom-tool-kit/nodemon'
```

## Options

| Key | Description | Default value |
|-|-|-|
| `entry` | path to the node application | `'./server/app.js'` |
| `configPath` | path to custom nodemon config | [automatic config resolution](https://github.com/remy/nodemon#config-files) |
| `useVault` | option to run the application with environment variables from Vault | `true` |
| `ports` | ports to try to bind to for this application | `[3001, 3002, 3003]` |

## Tasks

| Task | Description | Default hooks |
|-|-|-|
| `Nodemon` | Run application with `nodemon` | `run:local` |
