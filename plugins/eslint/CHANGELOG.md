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

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^3.4.1
    * @dotcom-tool-kit/types bumped from ^3.6.0 to ^3.6.1

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.0.0 to ^1.1.0

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.1.0 to ^1.1.1

## [4.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v4.0.2...eslint-v4.1.0) (2024-12-09)


### Features

* use cwd from task run context in remaining tasks ([c070cc2](https://github.com/Financial-Times/dotcom-tool-kit/commit/c070cc226b4633939fff349894a4a1a9d1987eef))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.0.0 to ^1.1.0
    * @dotcom-tool-kit/error bumped from ^4.0.0 to ^4.0.1
    * @dotcom-tool-kit/logger bumped from ^4.0.0 to ^4.0.1
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.1.1 to ^1.2.0

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v3.2.2...eslint-v4.0.0) (2024-09-10)


### ⚠ BREAKING CHANGES

* pass task files in as part of a run context object
* move eslint plugin options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* add configPath option for eslint task ([1c9ebd1](https://github.com/Financial-Times/dotcom-tool-kit/commit/1c9ebd14d051ee624051707076a4eb9d84eef190))
* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move eslint plugin options to task options ([22a17ad](https://github.com/Financial-Times/dotcom-tool-kit/commit/22a17adab5cce411b105bcdae802e78bb5c17e37))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* pass task files in as part of a run context object ([5aa7327](https://github.com/Financial-Times/dotcom-tool-kit/commit/5aa7327018c0a87c8c9feef36ef9e3735a4f5e6d))
* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0

## [3.2.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v3.2.0...eslint-v3.2.1) (2024-04-16)


### Bug Fixes

* remove exitCode from eslint-thrown errors ([8c314ff](https://github.com/Financial-Times/dotcom-tool-kit/commit/8c314ffafdc59112284a730ffc6933b8075f6790))

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
