# Developing Tool Kit

Tool Kit is a monorepo. The [`plugins`](/plugins) folder contains several different parts published separately to `npm`. [`core/cli`](/core/cli) is the main entry point. It loads plugins listed by an app's [Tool Kit configuration](../readme.md#configuration). These plugins export tasks that are available when running Tool Kit from your app's folder, allowing apps to include different plugins for different use cases.

Tool Kit requires Node v16. To install dependencies for every package in the workspace, run:

```sh
npm install
```

## Creating a plugin

There's a script to create a skeleton plugin. Run:

```sh
npm run create-plugin -- name-of-plugin
```

The script will create the plugin folder and add all the necessary configuration to get it building with Typescript.

## Development workflow

At the root of the repository, `npm run watch` will run the Typescript compiler and build files when you change them. It's recommended to leave that running while you develop things.

## Plugin structure

Tool Kit plugins are Node modules. Any code in the entry point of the plugin will be run when Tool Kit starts up and loads the plugin. You can use this for any initialisation the plugin needs to do, e.g. writing [state](#state) based on the environment. The module can export an array of [tasks](#tasks) and an object of [hooks](#hooks).

### Tasks

A task is a lightweight abstraction for running some tooling external to Tool Kit.

A task extends the class `Task` from `@dotcom-tool-kit/types`, implementing its abstract asynchronous `run` function. You also need to write a helpful `description` field, which will be displayed in the `--help` text.

```typescript
import { Task } from '@dotcom-tool-kit/types'

export default class Webpack extends Task {
  static description = 'bundle your code with webpack'

  async run(): Promise<void> {
    // call third-party tooling
  }
}
```

Tasks are usually placed in individual files in a `src/tasks` folder. In your plugin entry point, import your tasks, and export a `tasks` array containing the tasks:

```typescript
import Webpack from './tasks/webpack'

export const tasks = [Webpack]
```

Tasks won't be usable by your plugin's users unless you export them from the entry point.

### Hooks

A hook ensures a repo using Tool Kit has the relevant configuration to run things from Tool Kit.

A hook extends the `Hook` class from `@dotcom-tool-kit/types`, implementing its abstract asynchronous `check` and `install` functions. You also need to write a helpful `description` field, which will be displayed in the `--help` text.

```typescript
import { Hook } from '@dotcom-tool-kit/types'

export default NpmRunTest extends Hook {
  static description = 'hook to run tasks with `npm run test`'

  async check(): Promise<boolean> {
    // return true if the `test` script is correctly defined in `package.json`
  }

  async install(): Promise<void> {
    // do the work of inserting the `test` script into `package.json`
  }
}
```

In your plugin entry point, import your hook and export a `hooks` object, which maps names of hooks to the hook classes themselves:

```typescript
import NpmRunTest from './hooks/npm-test'

export const hooks = {
  'test:local': NpmRunTest
}
```

The name of a hook is a generic label that might be implemented by any type of hook, following a loose naming convention of `category:environment`, which should intuitively explain to a plugin's users what kind of tasks might be run by the hook.

This lets different plugins define the same abstractly labelled hooks with different implementations, e.g. we currently have a `circleci` plugin that defines hooks like `test:ci`; you could imagine `travisci` or `github-actions` plugin that implemented the same hooks but managed different configuration in a repo to run them.

### Options

#### Defining options

Plugins can define options that a user can configure in their repo's `.toolkitrc.yml`. We use the [`zod` library](https://zod.dev) to specify the schema, which allows us to define what we expect the options to look like and use this specification to validate the options we receive as well as generate TypeScript types for them. Options are defined in the `@dotcom-tool-kit/types` package, in the `schema` files. Create a file in [`src/schema`](../lib/types/src/schema/plugins) for your plugin, which should export a `NameOfPluginSchema` object (that should also be exported as `Schema`), and a `NameOfPluginOptions` type that uses the `SchemaOutput` generic type.

```typescript
import { z } from 'zod'

export const ESLintSchema = z.object({
  files: z.string().array().default(['**/*.js']),
  config: z.record(z.unknown()).optional(), // @deprecated: use options instead
  options: z.record(z.unknown()).optional()
})
export type ESLintOptions = z.infer<typeof ESLintSchema>

export const Schema = ESLintSchema
```

Import your plugin's schema file in `src/schema.ts`, and export its schema type in the `Schemas` export.

#### Using options

When Tool Kit loads, it will assemble any options for your plugin from `.toolkitrc.yml` files into a single options object. You can then add `@dotcom-tool-kit/options` as a dependency of your plugin, and call its `getOptions`:

```typescript
import { getOptions } from '@dotcom-tool-kit/options'

//...

const options = getOptions('@dotcom-tool-kit/name-of-plugin')
```

The options defined in the schema are set by plugins or apps in their `.toolkitrc.yml`. For example, the `files` option defined above would be configured like this:

```yml
options:
  '@dotcom-tool-kit/eslint':
    files:
      - '**/*.js'
```

To avoid boilerplate for tasks (the most common use case for options), when defining a task, you can pass a type parameter to the `Task` superclass, which accepts a schema type. The options for this plugin are then available as `this.options`. You can also define default values for your options by using `zod`'s [`.default()` method](https://zod.dev/?id=default).

```typescript
import { Task } from '@dotcom-tool-kit/types'
import { ESLintOptions, ESLintSchema } from '@dotcom-tool-kit/types/lib/schema/plugins/eslint'

export default class Eslint extends Task<typeof ESLintSchema> {
  static description = ''

  async run(): Promise<void> {
    this.options.files
  }
}
```

### State

Sometimes, Tool Kit tasks need information from previously-run tasks, or from the environment, that can't be provided via options. This could be the URL of a review app deployed by a previous task, or knowledge about which branch or tag the CI job is running on (which is provided in different ways by different CI platforms).

Tool Kit provides the `state` package to allow plugins to store and read this kind of data. It's stored in the filesystem in a `.toolkitstate` folder at the root of the repo running Tool Kit.

Look at the [`state` package](../lib/state/) to see how to define, read and write state.

## General philosophy

- The Tool Kit core (`cli/core` and the packages it depends on) should **never** depend on any particular plugin. This would prevent users from using alternatives to that plugin.

  If you find yourself needing to add something to the core for a particular plugin, think about how other plugins would work with it, and make sure what you're writing is general enough for any similar plugin to work with it.

- Write tests for your plugins. For tasks, this can be as simple as testing its `run` method calls its third-party tooling in the right way; stub out third-party tooling it's calling. For hooks, write integration tests and use fixtures liberally.

- Only add options for plugins if there's no other way of configuring things. If you're integrating third-party tooling with its own config file (like a `webpack.config.js` or `.babelrc`), don't replace that or provide options to merge with the tool's config.

  We don't want users to think we're doing something weird and custom; we should be providing _just enough_ abstraction for third-party tools to work together with other plugins.

- If you're writing something in a plugin you think could be abstracted into a general library, don't do that immediately; wait until there are a few usecases before refactoring it.

- **Errors are for users**. Don't throw an error when something is "wrong" with configuration but you know what the user meant. When you do throw an error, make sure it explains how to fix it; don't just say what went wrong, say _why_ it went wrong. If multiple things are erroring, collect them into a single error; users should never fix an error only to run into another error.
