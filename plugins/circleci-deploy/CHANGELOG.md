# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^4.0.0 to ^4.0.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^4.0.1 to ^4.0.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^4.0.2 to ^4.0.3

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.1.0 to ^5.1.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.1.1 to ^5.2.0

## [3.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v3.1.2...circleci-deploy-v3.2.0) (2023-05-30)


### Features

* **circleci:** add support for multiple Node versions ([10b15f4](https://github.com/Financial-Times/dotcom-tool-kit/commit/10b15f42f603c232293e15d05d4a062d7f855dbb))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.2.0 to ^5.3.0

## [3.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v3.0.0...circleci-deploy-v3.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.0.0 to ^5.1.0

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v2.1.0...circleci-deploy-v3.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^4.0.4 to ^5.0.0

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v2.0.3...circleci-deploy-v2.1.0) (2023-04-05)


### Features

* allow OIDC authentication for deploy:production hook ([7afa8d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/7afa8d37f8886dc6e7eccfc0e3e654789f5f4f85))
* **circleci-deploy:** log warning if you try to use Heroku and Serverless together ([3129d6e](https://github.com/Financial-Times/dotcom-tool-kit/commit/3129d6e9b269fc6ca8f580cc0582aa3aa8a7ac70))
* **orb:** clarify names of jobs in orb ([7ce7016](https://github.com/Financial-Times/dotcom-tool-kit/commit/7ce7016e975ee18b10786588c5d799667373b201))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^4.0.3 to ^4.0.4

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v1.0.0...circleci-deploy-v2.0.0) (2023-03-07)


### ⚠ BREAKING CHANGES

* **circleci:** rewrite CircleCI plugin to allow more flexible hooks

### Features

* **circleci-deploy:** pass serverless options to heroku-provision job ([c68f15b](https://github.com/Financial-Times/dotcom-tool-kit/commit/c68f15bc7c4ffe35f0aeb1b445221a6f21fbc319))
* **circleci:** rewrite CircleCI plugin to allow more flexible hooks ([b60c309](https://github.com/Financial-Times/dotcom-tool-kit/commit/b60c30921e62bab563a408600c31ff777c3f272b))


### Bug Fixes

* tidy up references in tsconfig files ([159b602](https://github.com/Financial-Times/dotcom-tool-kit/commit/159b6021e93922ebe6e4ca74297ad7a1c93290b3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^3.0.2 to ^4.0.0

## 1.0.0 (2023-01-24)


### Features

* split heroku logic into separate plugins ([331ae1a](https://github.com/Financial-Times/dotcom-tool-kit/commit/331ae1a11a17da0baa7db4e0c15a10a8420b6fb8))
