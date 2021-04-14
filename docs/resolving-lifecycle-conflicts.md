# Lifecycle conflicts

Tool Kit allows its plugins, and apps using it, to [assign commands to lifecycle events](../#lifecycle). It's possible for these commands to conflict between plugins, in which case you'll need to resolve the conflict.

## What causes conflicts?

If you have Tool Kit plugins installed that assign different commands to the same lifecycle events, that's a conflict. For example, both the `webpack` and `babel` plugins assign commands to `build:*` lifecycle events. When this happens, you'll get an error that looks like this:

```
These lifecycle events are assigned to different commands by multiple plugins':

build:local:
- webpack:development by plugin @dotcom-tool-kit/webpack
- babel:development by plugin @dotcom-tool-kit/babel
```

You might not be using the conflicting plugins directly; they might be installed as dependencies of other plugins you're using.

## Resolving conflicts

The [Tool Kit configuration](../#configuration) in your app will override any configuration from plugins, which is where default lifecycle assignments are defined. You can provide configuration in your `.toolkitrc.yml` or `package.json` `toolkit` field to specify which of the conflicting Tool Kit commands you want to run.

For example, if your app requires Webpack to run for `build:local` lifecycle events, but not Babel:

```yaml
lifecycles:
  "build:local": "webpack:development"
```

You can list an array of commands, which will be run in sequence. For example to run Webpack _then_ Babel:

```yaml
lifecycles:
  "build:local":
    - "webpack:development"
    - "babel:development"
```

Resolving the conflict isn't an arbitrary choice; it's entirely down to what your app requires, so make sure the resolution covers your usecases. For many standard usecases, there will be a plugin that includes a common set of plugins and lifecycle resolutions for them. Installing a usecase plugin would let the plugin take care of resolution, so you won't need to do it manually in your app.
