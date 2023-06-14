# dotcom-tool-kit

_(This README is for the core `dotcom-tool-kit` package that must be installed to use Tool Kit. You can find the documentation for the Tool Kit project itself at https://github.com/Financial-Times/dotcom-tool-kit/blob/main/readme.md.)_

The primary Tool Kit binary that will be invoked to handle all your hooks and tasks.

## Options

There are some global options available that will affect all plugins. All are optional but you can override them with the `dotcom-tool-kit` key.

| Key | Description | Default value |
|-|-|-|
| `allowNativeFetch` | use Node's native fetch if supported | `false` |
