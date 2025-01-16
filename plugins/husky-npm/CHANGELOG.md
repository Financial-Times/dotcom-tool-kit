# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^5.0.0 to ^5.0.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^5.0.1 to ^5.0.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^5.0.2 to ^5.0.3

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^5.0.3 to ^5.0.4

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^5.1.0 to ^5.1.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^5.1.1 to ^5.1.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^5.1.2 to ^5.1.3

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^5.1.3 to ^5.1.4

## [5.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v5.0.4...husky-npm-v5.1.0) (2025-01-02)


### Features

* add support for Node 22 ([df20e7c](https://github.com/Financial-Times/dotcom-tool-kit/commit/df20e7c455a16eeb3e75a2e940c93848d618a218))
* remove npm engine field ([aec1c78](https://github.com/Financial-Times/dotcom-tool-kit/commit/aec1c78aedb8f26a43b25824eb19e30101806182))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^5.0.4 to ^5.1.0

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v4.2.0...husky-npm-v5.0.0) (2024-09-10)


### ⚠ BREAKING CHANGES

* drop support for Node 16
* delete the husky hook
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* **husky-npm:** add PackageJson hook options ([b8f40dc](https://github.com/Financial-Times/dotcom-tool-kit/commit/b8f40dc3fa7e339252bdb5607bc8f43a5ff63c4b))
* move package-json-hook to plugins and export PackageJson hook ([56336e5](https://github.com/Financial-Times/dotcom-tool-kit/commit/56336e5cebb93c375dcaf28682f95f3da5b26c8a))


### Bug Fixes

* require package-json-hook plugin in plugins that use PackageJson hook ([892a4a6](https://github.com/Financial-Times/dotcom-tool-kit/commit/892a4a60c1f8641068cdf0bf3449bf1052c0556d))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* delete the husky hook ([8162c20](https://github.com/Financial-Times/dotcom-tool-kit/commit/8162c20d7ad425cb2d4405a518d09305134327e8))
* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove all current concrete hook subclasses ([62e7dc6](https://github.com/Financial-Times/dotcom-tool-kit/commit/62e7dc6d953efb9fa877143e77707cccee25d844))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0

## [4.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v4.1.0...husky-npm-v4.2.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^4.1.0 to ^4.2.0

## [4.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v4.0.0...husky-npm-v4.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^4.0.0 to ^4.1.0

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v3.0.0...husky-npm-v4.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^3.0.0 to ^4.0.0

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v2.2.1...husky-npm-v3.0.0) (2022-12-08)


### ⚠ BREAKING CHANGES

* **package-json-hook:** share state for package.json hook installers

### Features

* **package-json-hook:** share state for package.json hook installers ([0c8729f](https://github.com/Financial-Times/dotcom-tool-kit/commit/0c8729fc80f9b423189a2ae0e6aa87382b2663a8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^2.1.1 to ^3.0.0

### [2.2.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v2.2.0...husky-npm-v2.2.1) (2022-11-09)


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^2.1.0 to ^2.1.1

## [2.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v2.1.0...husky-npm-v2.2.0) (2022-08-05)


### Features

* Add commit message hook to husky plugin ([33d862e](https://github.com/Financial-Times/dotcom-tool-kit/commit/33d862e5d6fbb4039e797495435532626522c0bc))

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v2.0.0...husky-npm-v2.1.0) (2022-05-03)


### Features

* move HuskyHook into husky-npm ([c9f35f8](https://github.com/Financial-Times/dotcom-tool-kit/commit/c9f35f823e1ef57bf30f5c26d8a8907481136909))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^2.0.0 to ^2.1.0

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v1.9.0...husky-npm-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/husky-hook bumped from ^1.9.0 to ^2.0.0
