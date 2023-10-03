# @dotcom-tool-kit/component

A bootstrap plugin that provides the minimum required Tool Kit plugins for a "component" (aka an [npm module](https://github.com/Financial-Times/next/wiki/Naming-Conventions#npm-modules)). The plugins are:

- [`@dotcom-tool-kit/npm`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/npm)
- [`@dotcom-tool-kit/circleci-npm`](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/circleci-npm)

## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/component
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/component'
```
