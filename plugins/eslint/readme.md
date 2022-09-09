# @dotcom-tool-kit/eslint

A plugin to run [eslint](https://eslint.org/) in your JavaScript code. This plugin uses the ESLint Node.js [API](https://eslint.org/docs/latest/developer-guide/nodejs-api) to run ESLint. It loads the ESLint configuration files (.eslintrc.* files) in your repo by default.

## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/eslint
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/eslint'
```

## Options

| Key | Description | Default value |
|-|-|-|
| `files` | The glob patterns for lint target files. This can either be an array of string, or a string | `'**/*.js'` |
| `config` | The [options](https://eslint.org/docs/latest/developer-guide/nodejs-api#-new-eslintoptions) for the ESLint constructor. This allows for additional flexibility as some of these options, such as `errorOnUnmatchedPattern`, are only applicable at this level but not in your eslintrc.* file | n/a |

Example:
```
'@dotcom-tool-kit/eslint':
    files: server/*.js'
    config:
        errorOnUnmatchedPattern: false
```
## Tasks

| Task | Description | Preconfigured hook |
|-|-|-|
| `Eslint` | runs `eslint` to lint and format target files | `test:local`, `test:ci`, `test:staged` |