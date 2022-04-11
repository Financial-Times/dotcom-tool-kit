<h1 align="center">
   <img alt="FT.com Tool Kit" src="etc/logo.svg" width="300">
</h1>

[![CircleCI](https://circleci.com/gh/Financial-Times/dotcom-tool-kit.svg?style=svg&circle-token=f1f296a3a084deef4caabb72cfaf9617a654d244)](https://circleci.com/gh/Financial-Times/dotcom-tool-kit)

...is a modern approach to developer tooling for FT.com applications and components. The tools are **modular**: projects with different requirements can install different sets of plugins, which are all surfaced through a single command-line interface.

Tool Kit is under active develpment. Anything can and probably will change.

## TL;DR for Customer Products developers

* Tool Kit replaces your app's `Makefile`, as well as `n-gage` and `n-heroku-tools`
* You don't run Tool Kit directly, you run it using npm scripts, CircleCI jobs, and other similar tooling
* Tool Kit [automatically manages](#hooks) the configuration for this tooling, so your repo is always consistent
* Apps that have different requirements can install different plugins, instead of having to update and maintain nonstandard `Makefile` tasks

## Hooks

Tool Kit manages the build lifecycle for your app. Plugins can define **hooks** that can be run by developers, or other tooling like CI and hosting platforms. Hooks are things like `build`, `test` and `deploy` that are run during development, on CI servers, and on hosting platforms.

Tool Kit plugins manage the configuration to run their hooks automatically from other tooling. When Tool Kit loads, it verifies the configuration exists, and exits if something is missing. You can run `npx dotcom-tool-kit --install`, which will install most configuration automatically, and provide instructions to follow for any configuration it can't automatically install.

To allow apps to choose what they run, a hook defined by one plugin can be configured to run a task from another plugin.

For example, the `npm` plugin defines a `test:local` hook to be run by the `test` script in your package.json (i.e., what is run when you call `npm run test`) but it doesn't define what tests to run itself. That's handled by a plugin like `mocha`, which can be configured to run on the `test:local` hook, to run your Mocha test suite when you run `npm run test`.

Plugins can set a default task to run on a particular hook, to reduce configuration for common cases. For example, the `mocha` plugin configures itself to `test:*` hooks by default.

Plugins can also define default hooks for other plugins they depend on, allowing you to install preset plugins for common use cases that define and configure tasks for all the hooks your app needs.

If you, or a plugin, tries to configure a task to run on a hook that doesn't exist (which could be because you've not installed the plugin that defines it, or you've made a typo), Tool Kit will error, and list the available hooks.

If you have multiple plugins installed that configure different tasks to run on the same hame, you'll need to [resolve the conflict](docs/resolving-hook-conflicts.md).

### Plugins that define hooks

- [`circleci`](plugins/circleci/readme.md)
- [`heroku`](plugins/heroku/readme.md)
- [`npm`](plugins/npm/readme.md)

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

A Tool Kit plugin can also contain configuration, allowing plugins to provide defaults. App configuration will always override plugin configuration. For an example of a complete configuration file, see the [`.toolkitrc.yml` in the `frontend-app` plugin](plugins/frontend-app/.toolkitrc.yml).

### Options

#### `plugins`

A list of Tool Kit plugins to load. These plugins should be listed as `devDependencies` in your app's `package.json`.

#### `options`

An object containing options for Tool Kit plugins. The keys are the names of plugins, and the values are an options object which will be passed into that plugin's tasks:

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

## Development

Tool Kit is a monorepo. The [`plugins`](/plugins) folder contains several different parts published separately to `npm`. [`core/cli`](/core/cli) is the main entry point. It loads plugins listed by an app's [Tool Kit configuration](#configuration). These plugins export tasks that are available when running Tool Kit from your app's folder, allowing apps to include different plugins for different use cases.

Tool Kit requires Node v12. To install the dependencies and link internal packages together, run:

```sh
npm install
```

There's a testing sandbox at [`core/sandbox`](/core/sandbox) with Tool Kit installed as a dependency. In that directory, you can run `npx dotcom-tool-kit --help` to see what hooks and tasks are available.

Tool Kit tasks are implemented via a simple `async run()` function, and written in Typescript.

In the future, there will be unit and integration tests for every package.

### Creating a plugin

There's a script to create a skeleton plugin. Run:

```sh
npm run create-plugin -- name-of-plugin
```

and the script will create the plugin folder and add all the necessary configuration to get it building with Typescript.


To configure your plugin, do the following steps:
- define the hook in plugins/name-of-plugin/src/index.ts
  ```
  import Name-of-plugin from './tasks/name-of-plugin'
  import { PackageJsonHook } from '@dotcom-tool-kit/package-json-hook'

  ...

  class HookName extends PackageJsonHook {
    static description = '...'

    script = 'name-of-plugin'
    hook = '<the hook you defined in the name-of-plugin's toolkit.yml, eg. dummy:local>'
  }

  export const hooks = {
    '<any name, eg. dummy:local>': HookName,
  }
  ```
  you can find an example of this in plugins/npm/src/index.ts
- [optional] you can define the tasks used by the plugin in plugins/name-of-plugin/.toolkit.yml, otherwise the default task is set 
  ```
  hooks:
    '<name of the hooks defined>:<local|ci|*>': name-of-plugin
    (you can add more if you want here)
  ```
- [add the plugin](#plugins) to `core/sandbox/.toolkitrc.yml`.


Finally, build the created plugin by going to the root directory of this repository and running build:
```sh
cd ../../
npm run build
```
(Alternatively, you can run ```npm run watch``` in the root directory and it will rebuild the ts files that you've changed in these steps)

To test your plugin, you can install it in the sandbox package:

```sh
cd core/sandbox
npm install ../../plugins/name-of-plugin
npx dotcom-tool-kit --install
```

You can check if it's installed by running the help command:
```sh
npx dotcom-tool-kit --help
```
### Running the created plugin
After you have completed the steps in creating a plugin, you can run its hook: 
```sh
npx dotcom-tool-kit <hook eg. build:local>
```

### Contributing

Tool Kit is organised as a monorepo with all the different plugins and libraries stored in a single repository. This allows us to quickly investigate and make changes across the whole codebase, as well as making installation easier by sharing dependencies. However, release versions are not kept in sync between the packages, as we do not want to have to a major version bump for every package whenever we release a breaking change for a single package.

We use [release-please](https://github.com/googleapis/release-please) to manage releases and versioning. Every time we make a merge to main, release-please checks which packages have been changed, and creates a PR to make new releases for them. It uses the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard to determine whether updates require a patch, minor, or major version bump, and we use [commitlint](https://commitlint.js.org) to enforce the standard in all of our commits.

This means you should make an effort to think carefully about whether the changes you're making are a new feature or bug fix, and whether they contain any breaking changes. This might seem burdensome at first but it's good practice to make sure you can predict whether other teams' builds are going to break because of your code changes! If your commit will only affect a single package then please also include the name of the package (without the `@dotcom-tool-kit` namespace) in the scope of your commit message, as this makes it easier to see where changes are being made just by a quick glance at the git log. For example, a commit message for a new feature for the `circleci` plugin might look like:
```
feat(circleci): add support for nightly workflows
```

Note that new plugins should be created with a version number of `0.1.0`. This indicates that the package is still in the early stages of development and could be subject to many breaking changes before it's stabilised. Committing breaking changes whilst your package is `<1.0.0` are treated as minor bumps (`0.2.0`) and both new features and bug fixes as patch bumps (`0.1.1`.) When you're ready, you can release a 1.0 of your plugin by including `Release-As: 1.0.0` in the body of the release commit.

## Plugin structure

Tool Kit plugins are Node modules. Any code in the entry point of the plugin will be run when Tool Kit starts up and loads the plugin. If a plugin includes tasks, it should export a `tasks` array, contains [task classes](#tasks):

```typescript
import Webpack from './tasks/webpack'

export const tasks = [ Webpack ]
}
```

### Tasks

A task extends the class `Task`, implementing its abstract asynchronous `run` function. You should also specify a `description` field which will be displayed in the help menu. Note that any options for the plugin defined in the configuration will be passed to the `options` field.

```typescript
import { Task } from '@dotcom-tool-kit/task'

type WebpackOptions = {
  configPath?: string
}

export default class Webpack extends Task<WebpackOptions> {
  static description = 'bundle your code with webpack'

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
