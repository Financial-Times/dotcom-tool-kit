# Tool Kit

...is a modern approach to developer tooling for FT.com applications and components. The tools are **modular**: projects with different requirements can install different sets of plugins, which are all surfaced through a single command-line interface.

Tool Kit is under active develpment. Anything can and probably will change.

## Development

Tool Kit is a monorepo. The [`packages`](/packages) folder contains several different parts published separately to `npm`. [`packages/cli`](/packages/cli) is the main entry point. It loads plugins listed by an app's [Tool Kit configuration](#configuration). These plugins export commands that are available when running Tool Kit from your app's folder, allowing apps to include different plugins for different use cases.

Tool Kit requires Node v12. To install the dependencies and link internal packages together, run:

```sh
npm install
```

There's a testing sandbox at [`packages/sandbox`](/packages/sandbox) with Tool Kit installed as a dependency. In that directory, you can run `npx dotcom-tool-kit help` to see what commands are available.

Tool Kit commands are implemented with [Oclif](https://oclif.io/), the Open CLI Framework, and written in Typescript.

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

## Lifecycles

Tool Kit manages the build lifecycle for your app. It defines **lifecycle events** that can be run by developers, or other tooling like CI and hosting platforms:

### Events

| Event | When it runs | Why it runs |
|-|-|-|
| `build:*` | After installing project dependencies | To compile code or assets so an app can run |
| `test:*` | Locally when run by a developer, on CI, and when deploying an app | To run automated tests that verify an app is working correctly |
| `release:*` | After building an app on a hosting platform | To run secondary tasks related to deploying an app, e.g. database migrations or asset uploads |

<!-- NOT IMPLEMENTED YET
Tool Kit manages the configuration to run lifecycle events automatically from other tooling. On first install, it will modify your configuration files, and verify the configuration exists when it runs. It will install itself in these locations:

<table>
   <tr>
      <th>Event</th>
      <th>Environment</th>
      <th>Installed to...</th>
   </tr>
   <tr>
      <td rowspan="3" align="right"><code>build:</code></td>
      <td><code>local</code></td>
      <td>npm <code>postinstall</code> script</td>
   </tr>
   <tr>
      <td><code>ci</code></td>
      <td>CircleCI <code>build</code> job</td>
   </tr>
   <tr>
      <td><code>deploy</code></td>
      <td>npm <code>heroku-postbuild</code> script</td>
   </tr>
   <tr>
      <td rowspan="3" align="right"><code>test:</code></td>
      <td><code>local</code></td>
      <td>Git <code>prepush</code> hook</td>
   </tr>
   <tr>
      <td><code>ci</code></td>
      <td>CircleCI <code>test</code> job</td>
   </tr>
   <tr>
      <td><code>deploy</code></td>
      <td>Heroku "Release Phase" command</td>
   </tr>
   <tr>
      <td align="right"><code>release:</code></td>
      <td><code>deploy</code></td>
      <td>Heroku "Release Phase" command</td>
   </tr>
</table> -->

Tool Kit [plugins](#plugins) can configure which of their commands run by default on a particular lifecycle event. For example, the `webpack` plugin runs `webpack:development` on the `build:local` event.

Your app (and other plugins) can override these defaults in your [configuration](#configuration), so you can adapt the commands that run to your own needs (and so we can publish plugins that define common use cases composed of other plugins).

If you have multiple plugins installed that assign different commands to the same events, you'll need to [resolve the conflict](docs/resolving-lifecycle-conflicts.md).

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

#### `lifecycles`

An object assigning [lifecycle events](#events) to commands:

```yaml
lifecycles:
  "build:local": "webpack:development"
```

A lifecycle can be assigned to a single command, or a list of commands, which will run in sequence:

```yaml
lifecycles:
  "build:local":
    - "webpack:development"
    - "babel:development"
```

A plugin can list its own commands, or commands from any of the plugins it depends on. Plugins list their own commands as a default assignment.

If multiple plugins that are depended on by the same plugin set the same default event assignments, that's a conflict, and you won't be able to run Tool Kit without [resolving the conflict](docs/resolving-lifecycle-conflicts.md) in the parent plugin, or your app.

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
