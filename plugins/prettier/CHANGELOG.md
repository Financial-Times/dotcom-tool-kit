# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^2.0.0 to ^2.1.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.0.0 to ^2.1.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.1.0 to ^2.2.0

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
    * @dotcom-tool-kit/types bumped from ^2.5.1 to ^2.6.0

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
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^5.0.0 to ^5.0.1

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v3.2.1...prettier-v4.0.0) (2024-09-10)


### ⚠ BREAKING CHANGES

* pass task files in as part of a run context object
* remove prettier configOptions option
* move prettier options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* remove all current concrete hook subclasses
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move prettier options to task options ([71c24af](https://github.com/Financial-Times/dotcom-tool-kit/commit/71c24af0b1517008f530ce0ece85ccb9018e5100))
* **prettier:** add PackageJson hook options ([8895c3d](https://github.com/Financial-Times/dotcom-tool-kit/commit/8895c3d8f7908a6d611d912f8b3cc3ecfa85f2d9))
* remove prettier configOptions option ([6b143d4](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b143d43de921ae2ba66008ddeab83e3ea52d8ce))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Bug Fixes

* **prettier:** correct hook option field in config ([bba2a99](https://github.com/Financial-Times/dotcom-tool-kit/commit/bba2a996f95874655154dc9723933f0f2f56ece8))
* require package-json-hook plugin in plugins that use PackageJson hook ([892a4a6](https://github.com/Financial-Times/dotcom-tool-kit/commit/892a4a60c1f8641068cdf0bf3449bf1052c0556d))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([5367c9a](https://github.com/Financial-Times/dotcom-tool-kit/commit/5367c9a3e086412c28939c88700b67cb04afcfcd))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove all current concrete hook subclasses ([62e7dc6](https://github.com/Financial-Times/dotcom-tool-kit/commit/62e7dc6d953efb9fa877143e77707cccee25d844))


### Code Refactoring

* pass task files in as part of a run context object ([5aa7327](https://github.com/Financial-Times/dotcom-tool-kit/commit/5aa7327018c0a87c8c9feef36ef9e3735a4f5e6d))
* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0

## [3.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v3.1.6...prettier-v3.2.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.1.0 to ^3.2.0
    * @dotcom-tool-kit/logger bumped from ^3.3.1 to ^3.4.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.1.0 to ^4.2.0
    * @dotcom-tool-kit/types bumped from ^3.5.0 to ^3.6.0

## [3.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v3.0.0...prettier-v3.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/logger bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.0.0 to ^4.1.0
    * @dotcom-tool-kit/types bumped from ^3.0.0 to ^3.1.0

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v2.2.3...prettier-v3.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.1 to ^3.0.0
    * @dotcom-tool-kit/logger bumped from ^2.2.1 to ^3.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^3.0.0 to ^4.0.0
    * @dotcom-tool-kit/types bumped from ^2.10.0 to ^3.0.0

## [2.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v2.1.3...prettier-v2.2.0) (2023-03-07)


### Features

* handle default option values with zod ([7c03517](https://github.com/Financial-Times/dotcom-tool-kit/commit/7c0351771cf1a3d795803295a41dfea755176b19))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.2.0 to ^2.2.1
    * @dotcom-tool-kit/types bumped from ^2.8.0 to ^2.9.0

### [2.1.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v2.1.0...prettier-v2.1.1) (2022-12-08)


### Bug Fixes

* **prettier:** remove config for json files ([b6149df](https://github.com/Financial-Times/dotcom-tool-kit/commit/b6149df746449662577225c264fc93654cf222c9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^2.1.1 to ^3.0.0
    * @dotcom-tool-kit/types bumped from ^2.6.2 to ^2.7.0

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v2.0.9...prettier-v2.1.0) (2022-11-09)


### Features

* add jsx,json,tsx and ts file types to prettier defaults ([3bb813b](https://github.com/Financial-Times/dotcom-tool-kit/commit/3bb813b8ef977d6a9aaa32308dc232ab99619e84))


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/logger bumped from ^2.1.1 to ^2.1.2
    * @dotcom-tool-kit/package-json-hook bumped from ^2.1.0 to ^2.1.1
    * @dotcom-tool-kit/types bumped from ^2.6.1 to ^2.6.2

### [2.0.9](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v2.0.8...prettier-v2.0.9) (2022-09-21)


### Bug Fixes

* prettier plugin respects .prettierignore ([2a15eab](https://github.com/Financial-Times/dotcom-tool-kit/commit/2a15eab2432cf9b0464bc3c4023f59f136350059))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.6.0 to ^2.6.1

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v1.9.0...prettier-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/logger bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/types bumped from ^1.9.0 to ^2.0.0
