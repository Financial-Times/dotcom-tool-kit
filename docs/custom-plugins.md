# Creating a custom Tool Kit plugin

If your app requires some tooling that's not part of Tool Kit, you can write a custom plugin for that feature, which can work seamlessly together with the core Tool Kit plugins. This is the **only supported way** of using tooling that Tool Kit doesn't currently include.

If you're looking to implement tooling in your repository that would require things like custom `npm` scripts, Bash scripts, or editing the Tool Kit-managed CircleCI config, **you should be writing a custom plugin**.

A custom plugin can be written for a single repo or distributed as an npm package to be consumed by multiple repos owned by your team. The custom plugins themselves will be maintained and supported **by your team**, not Platforms. 

If there's wide demand for a particular custom plugin (for example, if it starts being used across multiple teams), we will consider adopting that plugin into Tool Kit. Writing a custom plugin (rather than implementing the tooling another way) will make it much more likely for us to be able to add the feature to Tool Kit.

## Common plugin structure

We recommend creating a `toolkit` folder at the root of your repository to contain your custom plugins, and folders inside that for each plugin. Each plugin folder should contain at least **an empty `.toolkitrc.yml` file** and **an empty `index.js`**.

Let's say you're creating a plugin to run [Rollup](https://rollupjs.org). Your folder structure should look like this:

```
└ toolkit
  └ rollup
    ├ .toolkitrc.yml
    └ index.js
```

This plugin can then be included in your top-level `.toolkitrc.yml` by referencing it as a relative path:

```yml
plugins:
  - './toolkit/rollup'
```

## Creating a task to be run by an existing hook

Consider the tooling you're implementing, and when you'd expect it to run. Tool Kit likely already has the hooks included for those scenarios, so have a look at the core plugins to see if there's something similar, and look at what hooks it runs on by default in its `.toolkitrc.yml`.

For something like Rollup, you'd probably expect it to run for local development, on continuous integration builds so you can run your tests, and when building an app so it can run in review or production. Tool Kit has a [built-in Webpack](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/webpack) plugin; since it's also a bundler, like Rollup, it's a good example to compare to for your custom plugin.

The Webpack plugin [runs by default](https://github.com/Financial-Times/dotcom-tool-kit/blob/main/plugins/webpack/.toolkitrc.yml) on the `build:local`, `build:ci`, and `build:remote` hooks, which sound like exactly the hooks you're looking for.

To get Rollup to run at these points, you'll need to create a subclass of the `Task` class from `@dotcom-tool-kit/types`, implement the `run` method, and export it in an array of `tasks`. Your `toolkit/rollup/index.js` might look like this:

```js
const { Task } = require('@dotcom-tool-kit/types')
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

exports.tasks = [Rollup]
```

Then, in the plugin's `.toolkitrc.yml`, list this task as the default task to run on the hooks you need:

```yml
hooks:
  'build:local': Rollup
  'build:ci': Rollup
  'build:remote: Rollup
```

You should install `@dotcom-tool-kit/types` and the tooling you're implementing as `devDependencies` of your repo (e.g. `npm install --save-dev @dotcom-tool-kit/types rollup`).

## Implementing a new hook

A Hook defines an abstract label to run tasks with, as well as managing where in other project configuration it's run from. For example, the built-in `circleci` plugin defines a `build:ci` hook, which lets tasks like Rollup run in CI, and it specifies that `build:ci` should be run by a CircleCI job and automatically manages the configuration in `.circleci/config.yml` to run that job.

This abstraction lets us write different plugins for defining tasks to be run, separate from the plugins defining where they should be run from, whilst maintaining the link between them. We've already seen that `build:ci` could be running Rollup, or Webpack, or any other task; in addition, `build:ci` itself could be defined by a different plugin, such as a Github Actions plugin, that would automatically manage configuration in `.github/workflows`.

The automatic configuration management is implemented by `Hook` subclasses. These define a `check` method that should return `true` if the hook is correctly installed in the repository or `false` if it needs installing, and an `install` method to actually perform the installation. Every time Tool Kit runs, it checks that every hook is installed in your repo, and if any aren't, it exits with an error (to ensure the repo is always consistent with what it expects). You can then run `dotcom-tool-kit --install` to run the installation of every hook that isn't installed.

If you find yourself asking a question like "how do I run a Tool Kit task from a different npm script", **you should implement a hook** to allow Tool Kit to automatically manage that configuration for any new repos using your plugin, rather than expecting new users to add that configuration themselves when installing the plugin.

Hooks have a loose naming convention of `category:environment`. This is only meant for humans to be able to intuitively understand which hooks are related; it's not required by the Tool Kit core itself.

Let's say you want to run some task on the npm `prepare` script (which automatically runs after `npm install` and before `npm publish`). We'll call that hook `prepare:local`, and the plugin will live in `toolkit/npm-prepare` ([structured as above](#common-plugin-structure)). Create a subclass of the `Hook` class from `@dotcom-tool-kit/types`, implement the `check` and `install` methods, and export a `hooks` object to map it to the name we're giving it. Your `toolkit/npm-prepare/index.js` might include:

```js
const { Hook } = require('@dotcom-tool-kit/types')
const loadPackageJson = require('@financial-times/package-json')

class PrepareHook extends Hook {
  get packageJson() {
    if (!this._packageJson) {
      const filepath = path.resolve(process.cwd(), 'package.json')
      this._packageJson = loadPackageJson({ filepath })
    }

    return this._packageJson
  }

  async check() {
    return this.packageJson.getField('scripts')?.prepare === 'dotcom-tool-kit prepare:local'
  }
  
  async install() {
    this.packageJson.requireScript({
      stage: 'prepare',
      command: 'dotcom-tool-kit prepare:local'
    })

    this.packageJson.writeChanges()
  }
}

export const hooks = {
  'prepare:local': PrepareHook
}
```

There are a handful of common base classes that Tool Kit includes for common hook usecases (such as CircleCI configuration or npm `package.json` scripts) that you can use those instead of implementing your hook completely from scratch. For example, we can build our `prepare:local` hook on top of the `PackageJsonHook` built-in class:

```js
const { PackageJsonHook } = require('@dotcom-tool-kit/package-json-hook')

class PrepareHook extends PackageJsonHook {
  key = 'prepare'
  hook = 'prepare:local'
}
```

After you've implemented your hook, running `dotcom-tool-kit --install` will add a `prepare` script to your `package.json`.

## Summary

- You can create new custom **tasks** to run tooling that Tool Kit doesn't support yet
- You can create custom **hooks** to run Tool Kit tasks in new scenarios
- Please [talk to the Platforms team](https://financialtimes.slack.com/archives/C02TRE2V2Q1) if you need help writing a custom plugin, want to discuss your use case, or to propose new features you think might be useful across multiple repositories & teams

✌️
