# @dotcom-tool-kit/webpack

Tool Kit plugin to run [Webpack](https://webpack.js.org)

## Installation & usage

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/webpack
```

And add it to your repo's `.toolkitrc.yml`:

```yml
plugins:
  - '@dotcom-tool-kit/webpack'
```

You will need plugins that provides hooks to run the `Webpack*` tasks.

### Building with Webpack locally

For local development, by default the `WebpackDevelopment` task runs on the `build:local` hook, and `WebpackWatch` runs on `run:local`. One plugin that provides these hooks is [`npm`](../npm), allowing you to run Webpack with `npm run build` and `npm start`. `WebpackWatch` runs Webpack in the background, allowing it to run alongside your other tasks that run on `run:local`, which lets you run e.g. your app with the [`node`](../node) plugin in parallel with Webpack.

### Building with Webpack on CI and remote apps

The `WebpackProduction` task runs on the `build:ci` and `build:remote` hooks by default. `build:ci` is for compiling an app's source in CI jobs, and is provided by plugins like [`circleci`](../circleci/). `build:remote` compiles an app for running on a production or testing server, and can be provided by plugins like [`heroku`](../heroku/).

### Running on another hook
You can also configure Webpack to run on any other hook; for example, if you want to run it with `npm run test` via the `npm` plugin, you can manually configure Webpack to run on `npm`'s `test:local` hook:

```yml
plugins:
  - '@dotcom-tool-kit/webpack'
  - '@dotcom-tool-kit/npm'
hooks:
  'test:local': WebpackDevelopment
```

## Tasks

| Task | Description | Default hooks |
|-|-|
| `WebpackDevelopment` | Run Webpack in development mode | `build:local` |
| `WebpackProduction` | Run Webpack in production mode | `build:ci`, `build:remote` |
| `WebpackWatch` | Run Webpack in watch mode in the background | `run:local` |
