# Developing Tool Kit

Tool Kit is a monorepo. The [`plugins`](/plugins) folder contains several different parts published separately to `npm`. [`core/cli`](/core/cli) is the main entry point. It loads plugins listed by an app's [Tool Kit configuration](#configuration). These plugins export tasks that are available when running Tool Kit from your app's folder, allowing apps to include different plugins for different use cases.

Tool Kit requires Node v12. To install the dependencies and link internal packages together, run:

```sh
npm install
```

There's a testing sandbox at [`core/sandbox`](/core/sandbox) with Tool Kit installed as a dependency. In that directory, you can run `npx dotcom-tool-kit --help` to see what hooks and tasks are available.

### Creating a plugin

There's a script to create a skeleton plugin. Run:

```sh
npm run create-plugin -- name-of-plugin
```

and the script will create the plugin folder and add all the necessary configuration to get it building with Typescript.


To configure your plugin, do the following steps:
- define the hook in plugins/name-of-plugin/src/index.ts
  ```typescript
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
  ```yaml
  hooks:
    '<name of the hooks defined>:<local|ci|*>': name-of-plugin
    # you can add more if you want here
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

## Running the created plugin
After you have completed the steps in creating a plugin, you can run its hook:
```sh
npx dotcom-tool-kit <hook eg. build:local>
```

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
import { Task } from '@dotcom-tool-kit/types'

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
