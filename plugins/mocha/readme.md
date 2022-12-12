# @dotcom-tool-kit/mocha

Tool Kit plugin to run [Mocha](http://mochajs.org)

## Installation & Usage

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/mocha
```

And add it to your repo's `.toolkitrc.yml`:

```yml
plugins:
  - '@dotcom-tool-kit/mocha'
```

## Options

| Key | Description | Default value |
|-|-|-|
| `files` | A file path glob to Mocha tests | `'test/**/*.js'` |
| `configPath` | Path to the [Mocha config file](https://mochajs.org/#configuring-mocha-nodejs) | use Mocha's own [config resolution](https://mochajs.org/#priorities) |

## Tasks

| Task | Description | Preconfigured hook |
|-|-|-|
| `Mocha` | runs `mocha` to execute tests | `test:local`, `test:ci` |

## Tips

A common use case is to configure `test:local` and `test:ci` in your `.toolkitrc.yml` to run the `Eslint` task then the relevant Mocha task: 

```yaml
hooks:
  test:local:
    - Eslint
    - Mocha
  test:ci:
    - Eslint
    - Mocha
```