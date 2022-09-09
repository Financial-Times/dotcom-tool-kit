# @dotcom-tool-kit/jest

A plugin to run [Jest](https://jestjs.io/) tests. This plugin uses [jest-cli](https://www.npmjs.com/package/jest-cli) to run the tests. You can configure this plugin by specifying the path to the Jest config path.

## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/jest
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/jest'
```

## Options

| Key | Description | Default value |
|-|-|-|
| `configPath` | Path to the [Jest config file](https://jestjs.io/docs/27.x/configuration) | use Jest's own [config resolution](https://jestjs.io/docs/configuration/) |

## Tasks

| Task | Description | Preconfigured hook |
|-|-|-|
| `JestLocal` | runs `jest` to execute tests | `test:local` |
| `JestCI` | runs `jest` to execute tests in the CI with the `--ci` [option](https://jestjs.io/docs/cli#--ci) | `test:ci` |

## Tips

A common use case is to configure `test:local` and `test:ci` in your `.toolkitrc.yml` to run the `Eslint` task then the relevant Jest task: 

```yaml
hooks:
  test:local:
    - Eslint
    - JestLocal
  test:ci:
    - Eslint
    - JestCI
```