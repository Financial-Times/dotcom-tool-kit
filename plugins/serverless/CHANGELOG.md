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

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.4.0 to ^3.4.1
    * @dotcom-tool-kit/doppler bumped from ^1.0.2 to ^1.0.3

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.3 to ^1.0.4

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.4 to ^1.0.5

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.5 to ^1.0.6

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.6 to ^1.0.7

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.7 to ^1.0.8

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.8 to ^1.0.9
    * @dotcom-tool-kit/options bumped from ^3.1.5 to ^3.1.6
    * @dotcom-tool-kit/types bumped from ^3.4.1 to ^3.5.0

## [2.4.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.4.1...serverless-v2.4.2) (2024-01-29)


### Bug Fixes

* **serverless:** remove aws-profile flag from ServerlessTeardown task ([6f89b82](https://github.com/Financial-Times/dotcom-tool-kit/commit/6f89b822532c89769a60ee3277a4c0f45c341f24))

## [2.4.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.4.0...serverless-v2.4.1) (2024-01-26)


### Bug Fixes

* **serverless:** read env vars on ServerlessTeardown task ([d115cf9](https://github.com/Financial-Times/dotcom-tool-kit/commit/d115cf95782b398dbbfbfb0256fd9e2f0fa4ce1e))

## [2.4.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.3.0...serverless-v2.4.0) (2024-01-23)


### Features

* add ServerlessTeardown task ([52b4d0f](https://github.com/Financial-Times/dotcom-tool-kit/commit/52b4d0f92586691b4d7ba150dabc3fda5fbcbd53))
* add teardown:review hook ([e00fcb4](https://github.com/Financial-Times/dotcom-tool-kit/commit/e00fcb4739f684ab62329dfe246b4981a9fdebc9))
* pass serverless stageName through review state ([7228d17](https://github.com/Financial-Times/dotcom-tool-kit/commit/7228d17001221fe46df0d89025654298baac2533))


### Bug Fixes

* fix the ServerlessTeardown import ([b67afdd](https://github.com/Financial-Times/dotcom-tool-kit/commit/b67afdd09d75100b005305ebd584b4ed5af5768a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/state bumped from ^3.2.0 to ^3.3.0

## [2.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.2.13...serverless-v2.3.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.9 to ^1.1.0
    * @dotcom-tool-kit/error bumped from ^3.1.0 to ^3.2.0
    * @dotcom-tool-kit/options bumped from ^3.1.6 to ^3.2.0
    * @dotcom-tool-kit/state bumped from ^3.1.1 to ^3.2.0
    * @dotcom-tool-kit/types bumped from ^3.5.0 to ^3.6.0

## [2.2.11](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.2.10...serverless-v2.2.11) (2023-11-24)


### Bug Fixes

* **serverless:** skip fetching secrets from Vault if Tool Kit migrated ([d667e67](https://github.com/Financial-Times/dotcom-tool-kit/commit/d667e6762fb7a4c255892eec31d4ca268603c64c))

## [2.2.10](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.2.9...serverless-v2.2.10) (2023-11-23)


### Bug Fixes

* **serverless:** don't call Doppler CLI in CI deployments ([9a69d50](https://github.com/Financial-Times/dotcom-tool-kit/commit/9a69d50ea6768bf39f90320cdc0287bd58c64f28))

## [2.2.8](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.2.7...serverless-v2.2.8) (2023-11-17)


### Bug Fixes

* **serverless:** confirm Serverless deployments have been successful ([8b9b00d](https://github.com/Financial-Times/dotcom-tool-kit/commit/8b9b00de7fb85ce92f13d58ec242174ef7c4607f))

## [2.2.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.2.2...serverless-v2.2.3) (2023-10-09)


### Bug Fixes

* **doppler:** match new name for production configs in Doppler ([bc5485f](https://github.com/Financial-Times/dotcom-tool-kit/commit/bc5485f56f3d8fcd608885f8fe9ba56a22265783))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.1 to ^1.0.2

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
