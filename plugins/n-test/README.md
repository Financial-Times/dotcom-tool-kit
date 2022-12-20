# @dotcom-tool-kit/n-test

A plugin to run smoke tests as part of your CircleCI workflow using the [n-test](https://github.com/Financial-Times/n-test) package.

## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/n-test
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/n-test'
```

## Options

| Key | Description | Default value |
|-|-|-|
| `browsers` | Array; Selenium browsers to run the test against | |
| `host` | Set the hostname to use for all tests | |
| `config` | Path to config file used to test | './test/smoke.js' |
| `interactive` | Boolean; interactively choose which tests to run | `false` |
| `header` | Request headers to be sent with every request. e.g. "X-Api-Key: 1234" | |

## Tasks

| Task | Description | Preconfigured hooks |
|-|-|-|
| `NTest` | runs smoke tests as part of your CircleCi workflow | `test:review`, `test:staging` |
