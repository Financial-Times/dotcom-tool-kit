# Changelog

## 1.0.0 (2024-04-26)


### ⚠ BREAKING CHANGES

* rename Task#options to pluginOptions
* move base classes into their own package

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* split remaining bits of types into config and plugins packages ([ee5839b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ee5839b7ac6a9fc8321beb8a7503f624aabf15b7))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/logger bumped from ^3.3.0 to ^4.0.0
