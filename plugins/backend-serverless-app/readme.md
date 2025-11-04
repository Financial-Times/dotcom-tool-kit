# @dotcom-tool-kit/backend-serverless-app

A bootstrap plugin that provides the minimum required Tool Kit plugins for a "backend" (aka an [API](https://github.com/Financial-Times/next/wiki/Naming-Conventions#apis)) that is deployed to AWS. The plugins are:

- [`@dotcom-tool-kit/npm`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/npm)
- [`@dotcom-tool-kit/circleci-deploy`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/circleci-deploy)
- [`@dotcom-tool-kit/serverless`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/serverless)
- [`@dotcom-tool-kit/node`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/node)

This bootstrap plugin is also preconfigured to run the `ServerlessRun` task on the hook `run:local`, and binds the tasks defined by the `serverless` plugin to the hooks defined by `circleci-deploy`.


## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/backend-serverless-app
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/backend-serverless-app'
```
