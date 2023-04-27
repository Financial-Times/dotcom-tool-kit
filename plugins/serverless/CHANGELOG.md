# Changelog

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