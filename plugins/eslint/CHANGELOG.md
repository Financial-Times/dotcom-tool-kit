# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.0.0 to ^2.1.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.2.0 to ^2.3.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.0.0 to ^2.1.0
    * @dotcom-tool-kit/types bumped from ^2.3.0 to ^2.4.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.4.0 to ^2.5.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.1.0 to ^2.1.1
    * @dotcom-tool-kit/types bumped from ^2.5.0 to ^2.5.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.6.0 to ^2.6.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.6.2 to ^2.7.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.1.2 to ^2.2.0
    * @dotcom-tool-kit/types bumped from ^2.7.0 to ^2.7.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.7.1 to ^2.8.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.9.0 to ^2.9.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.9.1 to ^2.9.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.9.2 to ^2.10.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.1.0 to ^3.2.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.1.0 to ^3.1.1
    * @dotcom-tool-kit/types bumped from ^3.2.0 to ^3.3.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.3.0 to ^3.3.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.1.1 to ^3.2.0
    * @dotcom-tool-kit/types bumped from ^3.3.1 to ^3.4.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.2.0 to ^3.3.0
    * @dotcom-tool-kit/types bumped from ^3.4.0 to ^3.4.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.3.0 to ^3.3.1
    * @dotcom-tool-kit/types bumped from ^3.4.1 to ^3.5.0

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v3.2.0...eslint-v4.0.0) (2024-04-26)


### ⚠ BREAKING CHANGES

* move eslint plugin options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* add configPath option for eslint task ([9d532fa](https://github.com/Financial-Times/dotcom-tool-kit/commit/9d532fa2f9438cf2b518a62fb3b306c071656429))
* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move eslint plugin options to task options ([d9a0d62](https://github.com/Financial-Times/dotcom-tool-kit/commit/d9a0d62633875ca198308dae3e0e2fa35cd7c621))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0

## [3.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v3.1.6...eslint-v3.2.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.1.0 to ^3.2.0
    * @dotcom-tool-kit/logger bumped from ^3.3.1 to ^3.4.0
    * @dotcom-tool-kit/types bumped from ^3.5.0 to ^3.6.0

## [3.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v3.0.0...eslint-v3.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/logger bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/types bumped from ^3.0.0 to ^3.1.0

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v2.3.3...eslint-v3.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.1 to ^3.0.0
    * @dotcom-tool-kit/logger bumped from ^2.2.1 to ^3.0.0
    * @dotcom-tool-kit/types bumped from ^2.10.0 to ^3.0.0

## [2.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v2.2.5...eslint-v2.3.0) (2023-03-07)


### Features

* handle default option values with zod ([7c03517](https://github.com/Financial-Times/dotcom-tool-kit/commit/7c0351771cf1a3d795803295a41dfea755176b19))


### Bug Fixes

* delete default options from plugins' .toolkitrc.yml files ([8a7d0ae](https://github.com/Financial-Times/dotcom-tool-kit/commit/8a7d0ae64d9c5a00acc05aceda867bcc4adec00d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.2.0 to ^2.2.1
    * @dotcom-tool-kit/types bumped from ^2.8.0 to ^2.9.0

### [2.2.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v2.2.1...eslint-v2.2.2) (2022-11-09)


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/logger bumped from ^2.1.1 to ^2.1.2
    * @dotcom-tool-kit/types bumped from ^2.6.1 to ^2.6.2

## [2.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v2.1.5...eslint-v2.2.0) (2022-09-14)


### Features

* deprecate config in favour for options in eslint ([831324a](https://github.com/Financial-Times/dotcom-tool-kit/commit/831324a40df17ca947fc000f51e011a2e79a4f91))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.5.1 to ^2.6.0

## [2.1.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v2.1.0...eslint-v2.1.1) (2022-06-08)


### Bug Fixes

* **eslint:** use || instead of | in eslint peerdependency syntax ([6430b82](https://github.com/Financial-Times/dotcom-tool-kit/commit/6430b82a86daa36daf14e3dec0c7cb7646fb6a04))

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v2.0.0...eslint-v2.1.0) (2022-06-07)


### Features

* **eslint:** use a peer dependency for eslint ([e16be4d](https://github.com/Financial-Times/dotcom-tool-kit/commit/e16be4da9312f50c3ec617bca3d5418c402c3715))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.1.0 to ^2.2.0

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v1.9.0...eslint-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/logger bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/types bumped from ^1.9.0 to ^2.0.0
