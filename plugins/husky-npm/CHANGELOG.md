# Changelog

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v4.2.0...husky-npm-v5.0.0) (2024-04-26)


### ⚠ BREAKING CHANGES

* drop support for Node 16
* delete the husky hook
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* move package-json-hook to plugins and export PackageJson hook ([e36d552](https://github.com/Financial-Times/dotcom-tool-kit/commit/e36d552f054526e4730781e1cd344d07e090fa6b))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* delete the husky hook ([38dd539](https://github.com/Financial-Times/dotcom-tool-kit/commit/38dd5391fa5f706926387479faca7ba2b9bbefdc))
* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove all current concrete hook subclasses ([ce2dd4b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce2dd4bf29b81e0160c7a70d2dde3623cb5e9d7a))


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
