# @dotcom-tool-kit/prettier

This plugin is for adding prettier onto your apps.

## Installation

Install `@dotcom-tool-kit/prettier` as a `devDependency` in your app:

```sh
npm install --save-dev @dotcom-tool-kit/prettier
```

Add the plugin to your [Tool Kit configuration](https://github.com/financial-times/dotcom-tool-kit/blob/main/readme.md#configuration):

```yaml
plugins:
	- '@dotcom-tool-kit/prettier'
```

And install this plugin's hooks:

```sh
npx dotcom-tool-kit --install
```

This will modify your `package.json`. You should commit this change.

### Options

| Key | Description | Default value |
|-|-|-|
| `files` | A required Array of strings of filepath(s) or filepath pattern(s) to be formatted | `['{,!(node_modules)/**/}*.js']` |
| `configOptions` | An optional prettier configuration object | <br>`{`<br>`    singleQuote: true,`<br>`    useTabs: true,`<br>`    bracketSpacing: true,`<br>`    arrowParens: 'always',`<br>`    trailingComma: 'none'`<br>`}`<br> |
| `configFile` | An optional String that specifies the prettier configuration file (.prettierrc.json). The configuration file will be resolved starting from the location of the file being formatted, and searching up the file tree until a config file is (or isn’t) found. If the configFile is not found the prettier plugin will default to configOptions. | `configOptions` value |

For more information on prettier configuration, visit the [Prettier docs](https://prettier.io/docs/en/configuration.html).
