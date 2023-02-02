# @dotcom-tool-kit/serverless

Tool Kit plugin to manage Lambdas with [AWS serverless](https://www.serverless.com/framework/docs/getting-started/).

## Installation & usage

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/serverless
```

And add it to your repo's `.toolkitrc.yml`:

```yml
plugins:
  - '@dotcom-tool-kit/serverless'
```

## Options

| Key | Description | Default value |
|-|-|-|
| `configPath` | [optional] path to your serverless config file. If this is not provided aws defaults to `./serverless.yml` but [other config fomats are accepted](https://www.serverless.com/framework/docs/providers/aws/guide/intro#alternative-configuration-format)| |
| `useVault` | option to run the application with environment variables from Vault | `true` |
| `ports` | ports to try to bind to for this application | `[3001, 3002, 3003]` |

## Tasks

| Task | Description | Default hooks |
|-|-|-|
| `ServerlessRun` | Run application with `serverless` | `run:local` |
