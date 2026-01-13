# `@dotcom-tool-kit/base`

Base classes for Tool Kit tasks, hooks and inits.

## Usage

`@dotcom-tool-kit/base` is used by the built-in Tool Kit plugins; most projects that use Tool Kit won't need to use this package directly.

If you're writing a [custom Tool Kit plugin](../../docs/extending-tool-kit.md#creating-a-custom-tool-kit-plugin), you'll need to install `@dotcom-tool-kit/base` as a dev dependency:

```
npm install --save-dev @dotcom-tool-kit/base
```

### Compatibility checking

When the Tool Kit CLI loads a task, hook, or init class from a plugin, it checks if that class is compatible with its version of `@dotcom-tool-kit/base`. This prevents versions of the CLI that are expecting new features in `base` from loading classes from an older version of `base` that doesn't have those features.

If you try to load a plugin from an incompatible version of `base`, you'll get an error that looks like this:

```
ℹ️ the task Webpack is not a compatible instance of Task:
 - object is from an outdated version of @dotcom-tool-kit/base, make sure you're using at least version 2.0.0 of the plugin
```

Check where the incompatible version is coming from with `npm ls @dotcom-tool-kit/base`, and update the intermediate dependencies that lead to the old version of `base` to their latest versions.

| Version in `dotcom-tool-kit` | Version in plugin | Compatible |
|-|-|
| `1.0.0` | `1.0.0` | ✅ |
| `1.0.0` | `1.1.0` | ✅ |
| `1.1.0` | `1.0.0` | ❌ |
| `2.0.0` | `1.0.0` | ❌ |
| `1.0.0` | `2.0.0` | ❌ |

## API (to do)

- [ ] Write/generate API documentation for `Task`, `Hook` and `Init`.
