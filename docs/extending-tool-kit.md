# Extending Tool Kit

Tool Kit provides a development workflow for tooling that's common to most Customer Products projects. But almost every project has unique requirements that the default set of plugins and configuration in Tool Kit doesn't cover. For these use cases, there are various ways you can extend Tool Kit.

You don't have to use Tool Kit for every tooling use case in your project. However, using Tool Kit for your custom tooling makes it more likely that it will be shareable between multiple projects and teams and potentially adopted into Tool Kit itself.

## Running existing Tool Kit tasks in new scenarios

In your repo's `.toolkitrc.yml`, you can define new commands to run tasks:

```yml
commands:
  build:e2e: Webpack
```

This can be run with `npx dotcom-tool-kit build:e2e`.

A task's options can be set on a per-command basis, allowing the same task to be used for multiple use cases:

```yml
commands:
  build:local:
    Webpack:
      configFile: webpack.config.js
  build:e2e:
    Webpack:
      configFile: webpack.e2e.config.js
```

Tool Kit **hooks** manage files like `package.json` and `.circleci/config.yml` to run commands from your existing tooling like npm scripts and CircleCI jobs. Hooks can be configured in your `.toolkitrc.yml` to integrate your new commands:

```yml
options:
  hooks:
    - PackageJson:
        scripts:
          e2e: build:e2e
    - CircleCIConfig:
        jobs:
          - name: build-e2e
            command: build:e2e
        workflows:
          - name: 'tool-kit'
            jobs:
              - name: build-e2e
                requires:
                  - setup
```

Adding this configuration and running `npx dotcom-tool-kit --install` will install the new npm script and CircleCI job into your repo, alongside the existing configuration from your Tool Kit plugins.

Some Tool Kit plugins, such as [`@dotcom-tool-kit/containerised-app-with-assets`](../plugins/containerised-app-with-assets) are **presets** that wrap other plugins for the standard Customer Products "golden path" use cases. These are intended to cover the default use case for almost all apps, and so you can't configure what's running within the plugin. If you have a use case that's not fully covered by the preset plugin, you can (partially or fully) "eject" from the preset and use its underlying plugins directly.

Let's say you wanted to run an additional task when running the `deploy:review` command. Start by copying that command from [the `.toolkitrc.yml` file in `containerised-app-with-assets`](../plugins/containerised-app-with-assets/.toolkitrc.yml) into your app's `.toolkitrc.yml`:

```yml
commands:
  'deploy:review':
    - Webpack:
        envName: production
    - UploadAssetsToS3
    - DockerAuthCloudsmith
    - DockerBuild
    - DockerPush
    - AwsAssumeRole:
        roleArn: !toolkit/option '@dotcom-tool-kit/containerised-app.awsRoleArnStaging'
    - HakoDeploy:
        asReviewApp: true
        environments: !toolkit/option '@dotcom-tool-kit/containerised-app.hakoReviewEnvironments'
```

This will override the `deploy:review` command configured by `containerised-app-with-assets`, so you can add your own tasks to this command:

```diff
commands:
  'deploy:review':
+   - CustomTask
    - Webpack:
        envName: production
    - UploadAssetsToS3
    - DockerAuthCloudsmith
    - DockerBuild
    - DockerPush
    - AwsAssumeRole:
        roleArn: !toolkit/option '@dotcom-tool-kit/containerised-app.awsRoleArnStaging'
    - HakoDeploy:
        asReviewApp: true
        environments: !toolkit/option '@dotcom-tool-kit/containerised-app.hakoReviewEnvironments'
```

If you need to fully customise the preset, you can go further and copy the entirety of the `plugins`, `commands` and `options` sections from the preset's `.toolkitrc.yml`, and remove the preset from your app's `plugins`. Note that any `!toolkit/option` tags that reference the preset's options will need to be moved inline, e.g. if you're ejecting `containerised-app` you'll need to replace any references to `!toolkit/option '@dotcom-tool-kit/containerised-app.<OPTION>` with the option value from your `.toolkitrc.yml`.

## Creating a custom Tool Kit plugin

If your app requires some tooling that's not provided by a first-party Tool Kit plugin, you can write a custom plugin for that feature, which works seamlessly together with the core Tool Kit plugins.

A custom plugin can be written for a single repo or distributed as an npm package to be consumed by multiple repos owned by your team. The custom plugins themselves will be maintained and supported **by your team**, not Platforms, although we can .

If there's wide demand for a particular custom plugin (for example, if it starts being used across multiple teams), we will consider adopting that plugin into Tool Kit. Writing a custom plugin (rather than implementing the tooling another way) will make it much more likely for us to be able to add the feature to Tool Kit.

### Common plugin structure

We recommend creating a `tool-kit` folder at the root of your repository to contain your custom plugins, and folders inside that for each plugin. Each plugin folder must contain at least a `.toolkitrc.yml` file.

The `.toolkitrc.yml` is the manifest that tells the Tool Kit plugin loader what your plugin needs to load. It must contain a `version` field (Tool Kit will currently only load a version `2` plugin), and for custom plugins will probably need a `tasks` field telling Tool Kit to load your custom tasks.

Let's say you're creating a plugin to run [Rollup](https://rollupjs.org). Your folder structure should look like this:

```
└ tool-kit
  └ rollup
    ├ .toolkitrc.yml
    └ tasks
      └ rollup.js
```

The `.toolkitrc.yml` would then contain:

```yml
version: 2

tasks:
  Rollup: ./tasks/rollup.js
```

This plugin can then be included in your top-level `.toolkitrc.yml` by referencing it as a relative path:

```yml
plugins:
  - './tool-kit/rollup'
```

### Writing the task

Create a subclass of the `Task` class from `@dotcom-tool-kit/base`, implement the `run` method, and export it as the default export of the task module.

You'll need to install `@dotcom-tool-kit/base` and the tooling you're implementing as `devDependencies` of your repo (e.g. `npm install --save-dev @dotcom-tool-kit/base rollup`).

Your `tool-kit/rollup/index.js` might look like this:

```js
const { Task } = require('@dotcom-tool-kit/base')
const rollup = require('rollup')
const loadConfigFile = require('rollup/dist/loadConfigFile')
const path = require('path')

class Rollup extends Task {
  async run() {
    const config = path.join(process.cwd(), 'rollup.config.js')
    const { options, warnings } = await loadConfigFile(config)

    // print any config warnings to the console
    warnings.flush()

    for (const optionsEntry of options) {
      const bundle = await rollup.rollup(optionsEntry)
      await Promise.all(optionsEntry.output.map(bundle.write))
    }
  }
}

module.exports = Rollup
```

> [!NOTE]
> If you're writing a task that runs something as an ongoing process, such as a server or a watch-mode build, you should also implement the `Task#stop` method to allow it to be stopped on error [when running tasks in parallel](../plugins/parallel), e.g.:
> ```js
> class Rollup extends Task {
>   async run() {
>     // ...
>     if(this.options.watch) {
>       this.watcher = rollup.watch(options)
>       // ...
>     } else {
>       // ...
>     }
>   }
>
>   stop() {
>     this.watcher?.close()
>   }
> }
> ```

Then, in the plugin's `.toolkitrc.yml`, you can provide the default commands this task will run on. It's preferable to do this in the plugin `.toolkitrc.yml` instead of your top-level `.toolkitrc.yml` so your plugin is self-contained and can be more easily moved into its own repo or Tool Kit itself, if it's something that can be shared between multiple repos/teams.

```yml
version: 2

tasks:
  Rollup: ./tasks/rollup.js

commands:
  'build:local': Rollup
  'build:ci': Rollup
  'build:remote': Rollup
```

### Defining options

It can sometimes be useful to allow for parameterisation in custom Tool Kit plugins. You might want to reuse the same task but have it read different config files in different commands, for instance. Or perhaps you're planning on eventually integrating your custom plugin into the main Tool Kit repository and you want to design it to be more flexible in advance. Tool Kit supports defining and using options in custom plugins in just like it does for plugins in the main repository, including defining your own schemas.

For example, let's update the Rollup plugin to allow the user to customise the file path to load the config from. All options are passed to the `Task` in the `options` property.

```js
const config = path.join(process.cwd(), this.options.configPath)
const { options, warnings } = await loadConfigFile(config)
```

Then we can pass the option value in the config:

```yml
options:
  task:
    Rollup:
      configPath: rollup.config.js
```

Additionally, we can define an options schema to ensure that the options passed to task are as we expect them to be, with the correct names and correct types. We use [`zod`](https://zod.dev/) to define our schemas. For plugin options, you should export your schema as the default object in a separate file and specify its path as a top-level `optionsSchema` option in your `.toolkitrc.yml`. For tasks and hooks, you should export your schema as a `schema` object in the same file as you export your task/hook. We could define a `zod` schema for the Rollup task like so:

```js
const z = require('zod')

const RollupSchema = z.object({ configPath: z.string() })
module.exports.schema = RollupSchema
```
