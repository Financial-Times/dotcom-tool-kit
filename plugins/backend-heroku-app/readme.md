# @dotcom-tool-kit/backend-heroku-app

A bootstrap plugin that provides the minimum required Tool Kit plugins for a "backend" (aka an [API](https://github.com/Financial-Times/next/wiki/Naming-Conventions#apis)) that is deployed to Heroku. The plugins are:

- [`@dotcom-tool-kit/npm`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/npm)
- [`@dotcom-tool-kit/circleci-deploy`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/circleci-deploy)
- [`@dotcom-tool-kit/heroku`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/heroku)
- [`@dotcom-tool-kit/node`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/node)

This bootstrap plugin is also preconfigured to run the `Node` task on the hook `run:local`, and binds the tasks defined by the `heroku` plugin to the hooks defined by `circleci-deploy`.


## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/backend-heroku-app
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/backend-heroku-app'
```
