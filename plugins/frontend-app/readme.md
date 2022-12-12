# @dotcom-tool-kit/frontend-app

A bootstrap plugin that provides the minimum required Tool Kit plugins for a "frontend" (aka an [App or Page](https://github.com/Financial-Times/next/wiki/Naming-Conventions#apps)). The plugins are:

- [`@dotcom-tool-kit/webpack`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/webpack)
- [`@dotcom-tool-kit/backend-app`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/backend-app)

This bootstrap plugin is also preconfigured to run the `Node`, `WebpackDevelopment`, and `WebpackWatch` tasks on the hook `run:local`.

## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/frontend-app
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/frontend-app'
```
