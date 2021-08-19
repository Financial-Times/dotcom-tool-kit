# Hooks conflicts

Tool Kit allows its plugins, and apps using it, to [configure tasks to run on hooks](../readme.md#hooks). It's possible for this configuration to conflict between plugins, in which case you'll need to resolve the conflict.

## What causes conflicts?

If you have Tool Kit plugins installed that configure different tasks to run on the same hook, that's a conflict. For example, both the `webpack` and `babel` plugins configure tasks to run on `build:*` hooks. When this happens, you'll get an error that looks like this:

```
These hooks are configured to run different tasks by multiple plugins:

build:local:
- WebpackDevelopment by plugin @dotcom-tool-kit/webpack
- BabelDevelopment by plugin @dotcom-tool-kit/babel
```

You might not be using the conflicting plugins directly; they might be installed as dependencies of other plugins you're using.

## Resolving conflicts

The [Tool Kit configuration](../readme.md#configuration) in your app will override any configuration from plugins, which is where default hook tasks are defined. You can provide configuration in your `.toolkitrc.yml` or `package.json` `toolkit` field to specify which of the conflicting Tool Kit tasks you want to run.

For example, if your app requires Webpack to run for `build:local` hooks, but not Babel:

```yaml
hooks:
  'build:local': WebpackDevelopment
```

You can list an array of tasks, which will be run in sequence. For example to run Webpack _then_ Babel:

```yaml
hooks:
  'build:local':
    - WebpackDevelopment
    - BabelDevelopment
```

Resolving the conflict isn't an arbitrary choice; it's entirely down to what your app requires, so make sure the resolution covers your usecases. For many standard usecases, there will be a plugin that includes a common set of plugins and hook resolutions for them. Installing a usecase plugin would let the plugin take care of resolution, so you won't need to do it manually in your app.
