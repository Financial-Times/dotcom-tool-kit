# @dotcom-tool-kit/serverless

Tool Kit plugin to manage Lambdas with [AWS serverless](https://www.serverless.com/framework/docs/getting-started/).

This plugin will be installed as a dependency of the [backend-serverless-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/backend-serverless-app) plugin, which we recommend using instead of installing this plugin directly. That plugin will install additional plugins that will be useful or most Customer Products projects at the FT.

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
| `awsAccountId` | [required] the ID of the AWS account you wish to deploy to (account IDs can be found at the [FT login page](https://awslogin.in.ft.com/)) | none |
| `systemCode` | [required] the system code for your app | none |
| `region` | [require] what AWS region you want to deploy to (usually `eu-west-1`) | none |
| `configPath` | [optional] path to your serverless config file. If this is not provided aws defaults to `./serverless.yml` but [other config fomats are accepted](https://www.serverless.com/framework/docs/providers/aws/guide/intro#alternative-configuration-format)| |
| `useVault` | option to run the application with environment variables from Vault | `true` |
| `ports` | ports to try to bind to for this application | `[3001, 3002, 3003]` |
| `buildNumVariable` | an environment variable used to get a unique ID to use in the provisioning stage | `CIRCLE_BUILD_NUM` |

## Tasks

| Task | Description | Default hooks |
|-|-|-|
| `ServerlessRun` | Run application with `serverless` | `run:local` |
| `ServerlessProvision` | Deploy review app with `serverless` | `deploy:review` |
| `ServerlessTeardown` | Remove review app with `serverless` | `teardown:review` |
| `ServerlessDeploy` | Deploy production app with `serverless` | `deploy:production` |
