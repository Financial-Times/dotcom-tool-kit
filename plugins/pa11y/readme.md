# @dotcom-tool-kit/pa11y

A plugin to run [Pa11y](https://github.com/pa11y/pa11y) accessibility tests. This plugin uses [Pa11y CI](https://github.com/pa11y/pa11y-ci) to run the tests.

## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/pa11y
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/pa11y'
```

## Options

| Key | Description | Default value |
|-|-|-|
| `configFile` | Path to the config file | `.pa11yci.js` |

## Tasks

| Task | Description | Preconfigured hook |
|-|-|-|
| `Pa11y` | runs `pa11y-ci` to execute Pa11y tests | `test:local` |

## To note

This plugin will define `process.env.TEST_URL` with the Heroku review app URL which can be used in your Pa11y CI config file.
