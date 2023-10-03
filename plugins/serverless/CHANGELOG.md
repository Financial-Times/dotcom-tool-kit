# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.1.0 to ^3.2.0
    * @dotcom-tool-kit/vault bumped from ^3.1.0 to ^3.1.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.2.0 to ^3.3.0
    * @dotcom-tool-kit/vault bumped from ^3.1.1 to ^3.1.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.3.0 to ^3.3.1
    * @dotcom-tool-kit/vault bumped from ^3.1.2 to ^3.1.3

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/state bumped from ^3.1.0 to ^3.1.1
    * @dotcom-tool-kit/doppler bumped from ^1.0.0 to ^1.0.1

## [2.2.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.2.0...serverless-v2.2.1) (2023-09-19)


### Bug Fixes

* **serverless:** recover $PATH env ([a368f04](https://github.com/Financial-Times/dotcom-tool-kit/commit/a368f04a73a3ad1761371d45bde08b5f375c6e29))

## [2.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.1.3...serverless-v2.2.0) (2023-09-19)


### Features

* migrate plugins to use Doppler instead of Vault ([e9611ef](https://github.com/Financial-Times/dotcom-tool-kit/commit/e9611efa3457fbf3ba8d0c00ed6fbb9e0ce203b1))


### Bug Fixes

* **serverless:** deploy with only  env vars from secrets mgmt service ([4e7d350](https://github.com/Financial-Times/dotcom-tool-kit/commit/4e7d3506129d03990dc54ccb4846a7e870f42cae))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.3.1 to ^3.4.0

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.0.0...serverless-v2.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/state bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/types bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/vault bumped from ^3.0.0 to ^3.1.0

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v1.0.0...serverless-v2.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.1 to ^3.0.0
    * @dotcom-tool-kit/state bumped from ^2.0.1 to ^3.0.0
    * @dotcom-tool-kit/types bumped from ^2.10.0 to ^3.0.0
    * @dotcom-tool-kit/vault bumped from ^2.0.16 to ^3.0.0

## 1.0.0 (2023-04-05)


### Features

* add serverless plugin ([2041b7d](https://github.com/Financial-Times/dotcom-tool-kit/commit/2041b7d65c941823f59cbba61b11d32fe67ed906))
* add task description to ServerlessRun ([d777c8a](https://github.com/Financial-Times/dotcom-tool-kit/commit/d777c8aac932c766c75e6e2c54a8d719a2b71634))
* handle default option values with zod ([7c03517](https://github.com/Financial-Times/dotcom-tool-kit/commit/7c0351771cf1a3d795803295a41dfea755176b19))
* **serverless:** add ServerlessDeploy task ([cd23f88](https://github.com/Financial-Times/dotcom-tool-kit/commit/cd23f88ce453a48dec393dc2645c7a22948e3944))
* **serverless:** define ServerlessProvision task ([6f49aaa](https://github.com/Financial-Times/dotcom-tool-kit/commit/6f49aaa80bb315e5dfd11068a21cb1d3e52ef36a))


### Bug Fixes

* **serverless:** export ServerlessDeploy task ([7277b58](https://github.com/Financial-Times/dotcom-tool-kit/commit/7277b58be3583d63f41485bc1ad59566c8dfbfbf))
* **serverless:** update @dotcom-tool-kit/types ([a3cd7bf](https://github.com/Financial-Times/dotcom-tool-kit/commit/a3cd7bfe15aa537b57e5534510fef03890d8e4d7))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.9.2 to ^2.10.0
    * @dotcom-tool-kit/vault bumped from ^2.0.12 to ^2.0.16
