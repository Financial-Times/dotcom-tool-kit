# Tool Kit

...is a modern approach to developer tooling for FT.com applications and components. The tools are **modular**: projects with different requirements can install different sets of plugins, which are all surfaced through a single command-line interface.

Tool Kit is under active develpment. Anything can and probably will change.

## Development

Tool Kit is a monorepo. The [`packages`](/packages) folder contains several different parts published separately to `npm`. [`packages/cli`](/packages/cli) is the main entry point. It loads plugins listed by an app's [Tool Kit configuration](#configuration). These plugins export commands that are available when running Tool Kit from your app's folder, allowing apps to include different plugins for different use cases.

Tool Kit requires Node v12. To install the dependencies and link internal packages together, run:

```sh
npm install
```

There's a testing sandbox at [`packages/test`](/packages/test) with Tool Kit installed as a dependency. In that directory, you can run `npx dotcom-tool-kit help` to see what commands are available.

Tool Kit commands are implemented with [Oclif](https://oclif.io/), the Open CLI Framework, and written in Typescript.

In the future, there will be unit and integration tests for every package.

## Configuration

Tool Kit supports configuration via a `toolkit` field in `package.json`:

```json
{
   ...
   "tootkit": {
      "plugins": [...]
   }
}
```

or via a separate file, `.toolkitrc`, which can be YAML or JSON format:

```yaml
plugins: []
```

A Tool Kit plugin can also contain configuration, allowing plugins to provide defaults. App configuration will always override plugin configuration.

### Options

#### `plugins`

A list of Tool Kit plugins to load. These plugins should be listed as `devDependencies` in your app's `package.json`.

## Plugin structure

Tool Kit plugins are Node modules. Any code in the entry point of the plugin will be run when Tool Kit starts up and loads the plugin. If a plugin includes commands, it should export a `commands` object, which maps command IDs to [command classes](#commands):

```typescript
import Webpack from './commands/webpack'

export const commands = {
   'webpack': Webpack
}
```

### Commands

A command can be any class with an asynchronous `run` function. When the class is loaded, the command-line arguments it was called with will be passed into the constructor (not including the command name) for parsing yourself:

```typescript
export default class Webpack {
   constructor(argv: string[]) {
      // parse argv into flags
   }

   async run() {
      // do things here
   }
}
```

Plugins can use the [`@oclif/command`]() package, which follows this structure, and includes the `@oclif/parser` argument parser:

```typescript
import Command, { flags } from '@oclif/command'

export default class Webpack extends Command {
   static flags = {
      production: flags.boolean()
   }

   constructor(argv: string[]) {
      const { flags } = this.parse(Webpack)
      this.flags = flags
   }

   async run() {
      // do things here
   }
}
```

## How does Tool Kit relate to...

### n-gage/n-heroku-tools

Tool Kit is a replacement for these tools built on modern, reliable, testable technologies.

### Page Kit

Page Kit provides common page-level components and an asset pipeline for user-facing FT.com applications. Tool Kit complements this by providing tooling to manage the application while developing.
