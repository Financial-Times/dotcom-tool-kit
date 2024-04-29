# Tool Kit plugin conflicts

When two Tool Kit plugins try to configure the same thing, that's a conflict that needs to be resolved. Anything a plugin configures in its `.toolkitrc.yml` can be a conflict. That includes things like which commands are running which hooks and options for tasks, hooks & plugins.

## Example of a plugin conflict

Both the `webpack` and `babel` plugins configure tasks to run on the `build:*` commands. If you install both of them in your app, you'll get an error that looks like this:

```
These commands are configured to run different tasks by multiple plugins:

build:local:
- Webpack by plugin @dotcom-tool-kit/webpack
- Babel by plugin @dotcom-tool-kit/babel
```

You might not be using the conflicting plugins directly; they might be installed as dependencies of other plugins you're using.

## Resolving conflicts

The [Tool Kit configuration](../readme.md#configuration) in your repo will override any configuration from plugins, which is treated as a default. You can provide configuration in your `.toolkitrc.yml` to specify which of the conflicting Tool Kit tasks you want to run.

For example, if your app requires Webpack to run for `build:local` hooks, but not Babel:

```yaml
commands:
  'build:local': Webpack
```

You can also list an array of tasks, which will be run in sequence. For example to run Webpack _then_ Babel:

```yaml
commands:
  'build:local':
    - Webpack
    - Babel
```

Conflicts between options in plugins are handled in the same way, by providing an override in your `.toolkitrc.yml`. Note that this is a full override; options from plugins aren't merged with your repo's configuration, so you'll need to provide the full set of options for a plugin or task if you're overriding them.

Resolving the conflict isn't an arbitrary choice; it's entirely down to what your app requires, so make sure the resolution covers your usecases. For many standard usecases, there will be a plugin that includes a common set of plugins and hook resolutions for them. Installing a usecase plugin would let the plugin take care of resolution, so you won't need to do it manually in your app.

## How conflicts are handled internally

Tool Kit loads plugins as a tree structure. When a plugin loads other plugins, we call those its **children**, and it their **parent**. The children are **sibling** plugins to each other. Tool Kit also considers your repo a plugin; it's the ultimate ancestor of all the other plugins loaded.

Conflicts only occur between sibling or nibling (child plugins of a sibling) plugins. When children plugins conflict, their parent plugin can override the conflicting configuration to resolve the conflict. If the conflict is left unresloved, it bubbles up through all the parent plugins in this branch of the plugin tree, giving them all an opportunity to resolve it. If the conflict is never resolved by any parent plugins (including your repo), Tool Kit will exit with an error explaining the conflict and which plugins caused it.
