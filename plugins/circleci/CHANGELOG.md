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
    * @dotcom-tool-kit/types bumped from ^2.5.1 to ^2.6.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.6.0 to ^2.6.1

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

## [5.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v5.0.0...circleci-v5.1.0) (2023-04-28)


### Features

* **circleci:** bump default version of node used in CircleCI config ([5820ca5](https://github.com/Financial-Times/dotcom-tool-kit/commit/5820ca5b3945a98f4a17ca5150b253135ed1989d))
* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Bug Fixes

* **circleci:** update majorOrbVersion to new published major version ([b6f9b11](https://github.com/Financial-Times/dotcom-tool-kit/commit/b6f9b111b934ef05269a1458ec9a2cc2fbc2a030))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/logger bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/state bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/types bumped from ^3.0.0 to ^3.1.0

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v4.0.4...circleci-v5.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^3.0.0
    * @dotcom-tool-kit/logger bumped from ^2.2.1 to ^3.0.0
    * @dotcom-tool-kit/state bumped from ^2.0.0 to ^3.0.0
    * @dotcom-tool-kit/types bumped from ^2.10.0 to ^3.0.0

## [4.0.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v4.0.2...circleci-v4.0.3) (2023-03-29)


### Bug Fixes

* **circleci:** correct installation error for unmanaged CircleCI configs ([df22de6](https://github.com/Financial-Times/dotcom-tool-kit/commit/df22de622b76fabf4d598a739b15a5eb0b585257))

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v3.0.2...circleci-v4.0.0) (2023-03-07)


### ⚠ BREAKING CHANGES

* **circleci:** rewrite CircleCI plugin to allow more flexible hooks

### Features

* **circleci:** rewrite CircleCI plugin to allow more flexible hooks ([b60c309](https://github.com/Financial-Times/dotcom-tool-kit/commit/b60c30921e62bab563a408600c31ff777c3f272b))


### Bug Fixes

* **circleci:** bump orb major version used when installing CircleCI ([423c6a0](https://github.com/Financial-Times/dotcom-tool-kit/commit/423c6a082c923b031264a3c8f142303adafe2935))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.2.0 to ^2.2.1
    * @dotcom-tool-kit/types bumped from ^2.8.0 to ^2.9.0

### [3.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v3.0.0...circleci-v3.0.1) (2022-12-14)


### Bug Fixes

* **circle:** remove filter job options from nightly jobs ([1c94b6a](https://github.com/Financial-Times/dotcom-tool-kit/commit/1c94b6afc6c9748e910b8d49474df1b105120db0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.1.1 to ^2.2.0
    * @dotcom-tool-kit/types bumped from ^2.7.0 to ^2.7.1

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v2.1.7...circleci-v3.0.0) (2022-12-08)


### ⚠ BREAKING CHANGES

* **circleci:** share state between circleci install hooks

### Features

* **circleci-heroku:** add support for using a Cypress docker image ([59f914a](https://github.com/Financial-Times/dotcom-tool-kit/commit/59f914aefdb7beae5e8ea0fac314efbc7194d802))
* **circleci:** add new error wording to circleci plugin ([5552c67](https://github.com/Financial-Times/dotcom-tool-kit/commit/5552c675720eea7df76c3434849e8487055296d9))
* **circleci:** only print jobs that are missing in error ([c75c3ad](https://github.com/Financial-Times/dotcom-tool-kit/commit/c75c3ad6d91fbc5779d2a3fbed853f474babfad0))
* **circleci:** share state between circleci install hooks ([fb04ccc](https://github.com/Financial-Times/dotcom-tool-kit/commit/fb04ccca5d5681609ce273a62f54de1f2cf86082))


### Performance Improvements

* improve lodash tree shaking ([454f9cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/454f9cd9984162141c7318165d723593295db678))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.6.1 to ^2.7.0

### [2.1.7](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v2.1.6...circleci-v2.1.7) (2022-11-09)


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/logger bumped from ^2.1.1 to ^2.1.2
    * @dotcom-tool-kit/state bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/types bumped from ^2.6.1 to ^2.6.2

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v2.0.0...circleci-v2.1.0) (2022-06-07)


### Features

* implement the new scheduled pipeline config in toolkit circleci hooks ([13ef342](https://github.com/Financial-Times/dotcom-tool-kit/commit/13ef342d62994a833f43c559bf1fc8772c945030))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.1.0 to ^2.2.0

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v1.9.0...circleci-v2.0.0) (2022-04-19)


### Bug Fixes

* don't assume version numbers in code ([b4ea80d](https://github.com/Financial-Times/dotcom-tool-kit/commit/b4ea80da7d831979541a28f26f28b4496eeaa5fe))


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/logger bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/state bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/types bumped from ^1.9.0 to ^2.0.0
