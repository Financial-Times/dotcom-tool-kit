# @dotcom-tool-kit/backend-app

A bootstrap plugin that provides the minimum required Tool Kit plugins for a "backend" (aka an [API](https://github.com/Financial-Times/next/wiki/Naming-Conventions#apis)). The plugins are:

- [`@dotcom-tool-kit/npm`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/npm)
- [`@dotcom-tool-kit/circleci-heroku`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/circleci-heroku)
- [`@dotcom-tool-kit/node`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/node)
- [`@dotcom-tool-kit/husky-npm`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/husky-npm)
- [`@dotcom-tool-kit/secret-squirrel`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/secret-squirrel)

This bootstrap plugin is also preconfigured to run the `Node` task on the hook `run:local`.

## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/backend-app
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/backend-app'
```
