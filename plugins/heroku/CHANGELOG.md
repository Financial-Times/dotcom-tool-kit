# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/npm bumped from ^2.0.1 to ^2.0.2
    * @dotcom-tool-kit/types bumped from ^2.0.0 to ^2.1.0
    * @dotcom-tool-kit/vault bumped from ^2.0.0 to ^2.0.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/npm bumped from ^2.0.3 to ^2.0.4
    * @dotcom-tool-kit/types bumped from ^2.2.0 to ^2.3.0
    * @dotcom-tool-kit/vault bumped from ^2.0.2 to ^2.0.3

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/npm bumped from ^2.0.5 to ^2.0.6
    * @dotcom-tool-kit/types bumped from ^2.4.0 to ^2.5.0
    * @dotcom-tool-kit/vault bumped from ^2.0.4 to ^2.0.5

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.1.0 to ^2.1.1
    * @dotcom-tool-kit/npm bumped from ^2.0.6 to ^2.0.7
    * @dotcom-tool-kit/types bumped from ^2.5.0 to ^2.5.1
    * @dotcom-tool-kit/vault bumped from ^2.0.5 to ^2.0.6

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/npm bumped from ^2.0.7 to ^2.0.8
    * @dotcom-tool-kit/types bumped from ^2.5.1 to ^2.6.0
    * @dotcom-tool-kit/vault bumped from ^2.0.6 to ^2.0.7

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/npm bumped from ^2.0.8 to ^2.0.9
    * @dotcom-tool-kit/types bumped from ^2.6.0 to ^2.6.1
    * @dotcom-tool-kit/vault bumped from ^2.0.7 to ^2.0.8

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/npm bumped from ^2.0.10 to ^2.0.11
    * @dotcom-tool-kit/package-json-hook bumped from ^2.1.1 to ^3.0.0
    * @dotcom-tool-kit/types bumped from ^2.6.2 to ^2.7.0
    * @dotcom-tool-kit/vault bumped from ^2.0.9 to ^2.0.10

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/heroku-v2.0.10...heroku-v2.1.0) (2022-11-09)


### Features

* add app region env var to Heroku ([04a5f8b](https://github.com/Financial-Times/dotcom-tool-kit/commit/04a5f8be7ce3208a0789cab970a3dadd7869e6db))


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/logger bumped from ^2.1.1 to ^2.1.2
    * @dotcom-tool-kit/npm bumped from ^2.0.9 to ^2.0.10
    * @dotcom-tool-kit/package-json-hook bumped from ^2.1.0 to ^2.1.1
    * @dotcom-tool-kit/state bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/types bumped from ^2.6.1 to ^2.6.2
    * @dotcom-tool-kit/vault bumped from ^2.0.8 to ^2.0.9
    * @dotcom-tool-kit/wait-for-ok bumped from ^2.0.0 to ^2.0.1

### [2.0.8](https://github.com/Financial-Times/dotcom-tool-kit/compare/heroku-v2.0.7...heroku-v2.0.8) (2022-08-09)


### Bug Fixes

* **heroku:** don't try to scale apps which haven't yet been deployed ([5686a04](https://github.com/Financial-Times/dotcom-tool-kit/commit/5686a04219dab992c8c6f1df5c1e5d262895f2d2))

### [2.0.5](https://github.com/Financial-Times/dotcom-tool-kit/compare/heroku-v2.0.4...heroku-v2.0.5) (2022-07-21)


### Bug Fixes

* filter appFormation array by type ([8ea0362](https://github.com/Financial-Times/dotcom-tool-kit/commit/8ea0362f1fe979e7d3505621186257e8d9bf407c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.0.0 to ^2.1.0
    * @dotcom-tool-kit/npm bumped from ^2.0.4 to ^2.0.5
    * @dotcom-tool-kit/types bumped from ^2.3.0 to ^2.4.0
    * @dotcom-tool-kit/vault bumped from ^2.0.3 to ^2.0.4

## [2.0.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/heroku-v2.0.2...heroku-v2.0.3) (2022-06-08)


### Bug Fixes

* **heroku:** scale dynos before promoting them to production ([6a3b53a](https://github.com/Financial-Times/dotcom-tool-kit/commit/6a3b53af7c41bab9a6d1cde98729c7751c986856))

## [2.0.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/heroku-v2.0.1...heroku-v2.0.2) (2022-06-07)


### Bug Fixes

* **heroku:** scale dynos before promoting them to production ([6a3b53a](https://github.com/Financial-Times/dotcom-tool-kit/commit/6a3b53af7c41bab9a6d1cde98729c7751c986856))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/npm bumped from ^2.0.2 to ^2.0.3
    * @dotcom-tool-kit/types bumped from ^2.1.0 to ^2.2.0
    * @dotcom-tool-kit/vault bumped from ^2.0.1 to ^2.0.2

### [2.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/heroku-v2.0.0...heroku-v2.0.1) (2022-05-03)


### Bug Fixes

* **heroku:** set NODE_ENV to 'branch' for review apps ([05c62dd](https://github.com/Financial-Times/dotcom-tool-kit/commit/05c62dd9415f20e83728f1cbf0051f9802d74044))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/npm bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/package-json-hook bumped from ^2.0.0 to ^2.1.0

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/heroku-v1.9.0...heroku-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/logger bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/npm bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/state bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/types bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/vault bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/wait-for-ok bumped from ^1.9.0 to ^2.0.0
