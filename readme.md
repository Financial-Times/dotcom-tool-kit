<h1 align="center">
   <img alt="FT.com Tool Kit" src="etc/logo.svg" width="300">
</h1>

[![CircleCI](https://circleci.com/gh/Financial-Times/dotcom-tool-kit.svg?style=svg&circle-token=f1f296a3a084deef4caabb72cfaf9617a654d244)](https://circleci.com/gh/Financial-Times/dotcom-tool-kit)

...is a modern approach to developer tooling for FT.com applications and components. The tools are **modular**: projects with different requirements can install different sets of plugins, which are all surfaced through a single command-line interface.

Tool Kit is under active develpment. Anything can and probably will change.

## Development

Tool Kit is a monorepo. The [`packages`](/packages) folder contains several different parts published separately to `npm`. [`packages/cli`](/packages/cli) is the main entry point. It loads plugins listed by an app's [Tool Kit configuration](#configuration). These plugins export commands that are available when running Tool Kit from your app's folder, allowing apps to include different plugins for different use cases.

Tool Kit requires Node v12. To install the dependencies and link internal packages together, run:

```sh
npm install
```

There's a testing sandbox at [`packages/sandbox`](/packages/sandbox) with Tool Kit installed as a dependency. In that directory, you can run `npx dotcom-tool-kit help` to see what commands are available.

Tool Kit commands are implemented via a simple `async run()` function, and written in Typescript.

In the future, there will be unit and integration tests for every package.

### Creating a plugin

There's a script to create a skeleton plugin. Run:

```sh
npm run create-plugin -- name-of-plugin
```

and the script will create the plugin folder and add all the necessary configuration to get it building with Typescript.

To test your plugin, you can install it in the sandbox package:

```sh
cd packages/sandbox
npm install ../name-of-plugin
```

and [add the plugin](#plugins) to `packages/sandbox/.toolkitrc.yml`.

## Hooks

Tool Kit manages the build lifecycle for your app. Plugins can define **hooks** that can be run by developers, or other tooling like CI and hosting platforms. Hooks are things like `build`, `test` and `deploy` that are run during development, on CI servers, and on hosting platforms.

Tool Kit plugins manage the configuration to run their hooks automatically from other tooling. When Tool Kit loads, it verifies the configuration exists, and exits if something is missing. You can run `npx dotcom-tool-kit --install`, which will install most configuration automatically, and provide instructions to follow for any configuration it can't automatically install.

To allow apps to choose what they run, a hook defined by one plugin can be configured to run a task from another plugin.

For example, the `npm` plugin defines a `test:local` hook to be run by the `test` script in your package.json (i.e., what is run when you call `npm run test`) but it doesn't define what tests to run itself. That's handled by a plugin like `mocha`, which can be configured to run on the `test:local` hook, to run your Mocha test suite when you run `npm run test`.

Plugins can set a default command to run on a particular hook, to reduce configuration for common cases. For example, the `mocha` plugin configures itself to `test:*` hooks by default.

Plugins can also define default hooks for other plugins they depend on, allowing you to install preset plugins for common use cases that define and configure tasks for all the hooks your app needs.

If you, or a plugin, tries to configure a task to run on a hook that doesn't exist (which could be because you've not installed the plugin that defines it, or you've made a typo), Tool Kit will error, and list the available hooks.

If you have multiple plugins installed that configure different tasks to run on the same hame, you'll need to [resolve the conflict](docs/resolving-hook-conflicts.md).

### Plugins that define hooks

- [`circleci`](packages/circleci/readme.md)
- [`heroku`](packages/heroku/readme.md)
- [`npm`](packages/npm/readme.md)

## Configuration

Tool Kit supports configuration via a `toolkit` field in `package.json`:

```json
{
   ...
   "toolkit": {
      "plugins": [...]
   }
}
```

or via a separate file, `.toolkitrc`, which can be YAML or JSON format:

```yaml
plugins: []
```

A Tool Kit plugin can also contain configuration, allowing plugins to provide defaults. App configuration will always override plugin configuration. For an example of a complete configuration file, see the [`.toolkitrc.yml` in the `frontend-app` plugin](packages/frontend-app/.toolkitrc.yml).

### Options

#### `plugins`

A list of Tool Kit plugins to load. These plugins should be listed as `devDependencies` in your app's `package.json`.

#### `options`

An object containing options for Tool Kit plugins. The keys are the names of plugins, and the values are an options object which will be passed into that plugin's commands:

```yaml
options:
  "@dotcom-tool-kit/eslint":
    files:
      - "**/*.js"
```

#### `hooks`

An object configuring which tasks run on which [hooks](#hooks):

```yaml
hooks:
  "build:local": WebpackDevelopment
```

A hook can be configured to run a single task, or a list of task, which will run in sequence:

```yaml
hooks:
  "build:local":
    - WebpackDevelopment
    - BabelDevelopment
```

A plugin can list its own tasks, or tasks from any other plugin included by the app.

If multiple plugins try to configure the same hooks, that's a conflict, and you won't be able to run Tool Kit without [resolving the conflict](docs/resolving-hook-conflicts.md) in a parent plugin, or your app.

## Plugin structure

Tool Kit plugins are Node modules. Any code in the entry point of the plugin will be run when Tool Kit starts up and loads the plugin. If a plugin includes commands, it should export a `commands` object, which maps command IDs to [command classes](#commands):

```typescript
import Webpack from './commands/webpack'

export const commands = {
   'webpack': Webpack
}
```

### Commands

A command extends the class `Command`, implementing its abstract asynchronous `run` function. You should also specify a `description` field which will be displayed in the help menu. Note that any options for the plugin defined in the configuration will be passed to the `options` field.

```typescript
import { Command } from '@dotcom-tool-kit/task'

type WebpackOptions = {
  configPath?: string
}

export default class Webpack extends Command {
  static description = 'bundle your code with webpack'

  options: WebpackOptions = {}

  async run(): Promise<void> {
    // do things here
  }
}
```

## How does Tool Kit relate to...

### n-gage/n-heroku-tools

Tool Kit is a replacement for these tools built on modern, reliable, testable technologies.

### Page Kit

Page Kit provides common page-level components and an asset pipeline for user-facing FT.com applications. Tool Kit complements this by providing tooling to manage the application while developing.
