# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/husky-npm bumped from ^2.0.0 to ^2.1.0
    * @dotcom-tool-kit/lint-staged bumped from ^2.0.0 to ^2.1.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^2.1.0 to ^2.1.1
    * @dotcom-tool-kit/options bumped from ^2.0.0 to ^2.0.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^2.1.1 to ^2.1.2
    * @dotcom-tool-kit/options bumped from ^2.0.1 to ^2.0.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^2.1.2 to ^2.1.3
    * @dotcom-tool-kit/options bumped from ^2.0.2 to ^2.0.3

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^2.1.3 to ^2.1.4
    * @dotcom-tool-kit/options bumped from ^2.0.3 to ^2.0.4

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^2.1.4 to ^2.1.5
    * @dotcom-tool-kit/options bumped from ^2.0.4 to ^2.0.5

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/husky-npm bumped from ^2.1.0 to ^2.2.0
    * @dotcom-tool-kit/lint-staged bumped from ^2.1.5 to ^2.1.6
    * @dotcom-tool-kit/options bumped from ^2.0.5 to ^2.0.6

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^2.1.6 to ^2.1.7
    * @dotcom-tool-kit/options bumped from ^2.0.6 to ^2.0.7

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^2.1.7 to ^2.1.8
    * @dotcom-tool-kit/options bumped from ^2.0.7 to ^2.0.8

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/husky-npm bumped from ^2.2.1 to ^3.0.0
    * @dotcom-tool-kit/lint-staged bumped from ^2.1.9 to ^3.0.0
    * @dotcom-tool-kit/options bumped from ^2.0.9 to ^2.0.10

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^3.0.0 to ^3.0.1
    * @dotcom-tool-kit/options bumped from ^2.0.10 to ^2.0.11

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^3.0.1 to ^3.0.2
    * @dotcom-tool-kit/options bumped from ^2.0.11 to ^2.0.12

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^3.0.2 to ^3.0.3
    * @dotcom-tool-kit/options bumped from ^2.0.12 to ^2.0.13

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^3.0.3 to ^3.0.4
    * @dotcom-tool-kit/options bumped from ^2.0.13 to ^2.0.14

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^3.0.4 to ^3.0.5
    * @dotcom-tool-kit/options bumped from ^2.0.14 to ^2.0.15

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^3.0.5 to ^3.0.6
    * @dotcom-tool-kit/options bumped from ^2.0.15 to ^2.0.16

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^4.1.0 to ^4.1.1
    * @dotcom-tool-kit/options bumped from ^3.1.0 to ^3.1.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^4.1.1 to ^4.1.2
    * @dotcom-tool-kit/options bumped from ^3.1.1 to ^3.1.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^4.1.2 to ^4.1.3
    * @dotcom-tool-kit/options bumped from ^3.1.2 to ^3.1.3

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^4.1.3 to ^4.1.4
    * @dotcom-tool-kit/options bumped from ^3.1.3 to ^3.1.4

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^4.1.4 to ^4.1.5
    * @dotcom-tool-kit/options bumped from ^3.1.4 to ^3.1.5

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/lint-staged bumped from ^4.1.5 to ^4.1.6
    * @dotcom-tool-kit/options bumped from ^3.1.5 to ^3.1.6

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/lint-staged-npm-v3.2.0...lint-staged-npm-v4.0.0) (2024-04-30)


### ⚠ BREAKING CHANGES

* drop support for Node 16
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* **lint-staged-npm:** add PackageJson hook options ([e6e8f39](https://github.com/Financial-Times/dotcom-tool-kit/commit/e6e8f397b8661fd62a5b2fba4cdec3fa9be0f1a5))


### Bug Fixes

* require package-json-hook plugin in plugins that use PackageJson hook ([49d9733](https://github.com/Financial-Times/dotcom-tool-kit/commit/49d97337da2a6c92440f32ba7740e28ec3fc7edc))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove all current concrete hook subclasses ([ce2dd4b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce2dd4bf29b81e0160c7a70d2dde3623cb5e9d7a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/husky-npm bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/lint-staged bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0

## [3.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/lint-staged-npm-v3.1.6...lint-staged-npm-v3.2.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/husky-npm bumped from ^4.1.0 to ^4.2.0
    * @dotcom-tool-kit/lint-staged bumped from ^4.1.6 to ^4.2.0
    * @dotcom-tool-kit/options bumped from ^3.1.6 to ^3.2.0

## [3.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/lint-staged-npm-v3.0.0...lint-staged-npm-v3.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/husky-npm bumped from ^4.0.0 to ^4.1.0
    * @dotcom-tool-kit/lint-staged bumped from ^4.0.0 to ^4.1.0
    * @dotcom-tool-kit/options bumped from ^3.0.0 to ^3.1.0

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/lint-staged-npm-v2.0.18...lint-staged-npm-v3.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/husky-npm bumped from ^3.0.0 to ^4.0.0
    * @dotcom-tool-kit/lint-staged bumped from ^3.0.6 to ^4.0.0
    * @dotcom-tool-kit/options bumped from ^2.0.16 to ^3.0.0

## [2.0.14](https://github.com/Financial-Times/dotcom-tool-kit/compare/lint-staged-npm-v2.0.13...lint-staged-npm-v2.0.14) (2023-01-24)


### Bug Fixes

* **lint-staged-npm:** add proper hook descriptions ([5bcabf4](https://github.com/Financial-Times/dotcom-tool-kit/commit/5bcabf4a954ef3f67b69bb5c4a5100602c9decda))

### [2.0.10](https://github.com/Financial-Times/dotcom-tool-kit/compare/lint-staged-npm-v2.0.9...lint-staged-npm-v2.0.10) (2022-11-09)


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/husky-npm bumped from ^2.2.0 to ^2.2.1
    * @dotcom-tool-kit/lint-staged bumped from ^2.1.8 to ^2.1.9
    * @dotcom-tool-kit/options bumped from ^2.0.8 to ^2.0.9

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/lint-staged-npm-v1.9.0...lint-staged-npm-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/husky-npm bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/lint-staged bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/options bumped from ^1.9.0 to ^2.0.0
