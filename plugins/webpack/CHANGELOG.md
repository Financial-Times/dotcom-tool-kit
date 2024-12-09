# Changelog

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
    * @dotcom-tool-kit/schemas bumped from ^1.1.0 to ^1.1.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.0 to ^1.1.1
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.2.0 to ^1.3.0

## [4.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v4.0.2...webpack-v4.1.0) (2024-12-09)


### Features

* run task child processes in the cwd from the task run context ([14d52f8](https://github.com/Financial-Times/dotcom-tool-kit/commit/14d52f81f874a37c12bab3a6fbfddde5ff8d72e7))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.0.0 to ^1.1.0
    * @dotcom-tool-kit/error bumped from ^4.0.0 to ^4.0.1
    * @dotcom-tool-kit/logger bumped from ^4.0.0 to ^4.0.1
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.1.1 to ^1.2.0

## [4.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v4.0.0...webpack-v4.0.1) (2024-09-16)


### Bug Fixes

* **webpack:** define Webpack task options for commands ([d3b55cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/d3b55cdd3ef499707a808171ac0c253e54791489))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.0.0 to ^1.1.0

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v3.2.1...webpack-v4.0.0) (2024-09-10)


### ⚠ BREAKING CHANGES

* move webpack options to task options and allow configuring env
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move webpack options to task options and allow configuring env ([658c9bb](https://github.com/Financial-Times/dotcom-tool-kit/commit/658c9bb2b78843318da943e00e1a8fe2ef7bb4a9))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0

## [3.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v3.1.7...webpack-v3.2.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.1.0 to ^3.2.0
    * @dotcom-tool-kit/logger bumped from ^3.3.1 to ^3.4.0
    * @dotcom-tool-kit/types bumped from ^3.5.0 to ^3.6.0

## [3.1.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v3.1.0...webpack-v3.1.1) (2023-05-23)


### Bug Fixes

* **webpack:** work around incompatibility between Webpack 4 and Node 18 ([00108e6](https://github.com/Financial-Times/dotcom-tool-kit/commit/00108e66cac5f04d3a90eee6da58395de982ea53))

## [3.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v3.0.0...webpack-v3.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/logger bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/types bumped from ^3.0.0 to ^3.1.0

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v2.1.15...webpack-v3.0.0) (2023-04-18)


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

## [2.1.12](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v2.1.11...webpack-v2.1.12) (2023-03-07)


### Bug Fixes

* tidy up references in tsconfig files ([159b602](https://github.com/Financial-Times/dotcom-tool-kit/commit/159b6021e93922ebe6e4ca74297ad7a1c93290b3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.2.0 to ^2.2.1
    * @dotcom-tool-kit/types bumped from ^2.8.0 to ^2.9.0

### [2.1.8](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v2.1.7...webpack-v2.1.8) (2022-11-09)


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/logger bumped from ^2.1.1 to ^2.1.2
    * @dotcom-tool-kit/types bumped from ^2.6.1 to ^2.6.2

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v2.0.0...webpack-v2.1.0) (2022-05-06)


### Features

* **webpack:** add watch mode command for run:local by default ([001a881](https://github.com/Financial-Times/dotcom-tool-kit/commit/001a881c85e5e123cc43075e367c3825c0538d4f))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.0.0 to ^2.1.0

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v1.9.0...webpack-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/logger bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/types bumped from ^1.9.0 to ^2.0.0
