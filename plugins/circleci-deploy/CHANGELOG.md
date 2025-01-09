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

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.3.0 to ^5.3.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.3.1 to ^5.3.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.3.2 to ^5.3.3

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.3.3 to ^5.3.4

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.3.4 to ^5.3.5

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.3.5 to ^5.3.6

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.3.6 to ^5.3.7

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.3.7 to ^5.3.8

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.3.8 to ^5.3.9

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.4.1 to ^6.0.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^6.0.0 to ^6.0.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^6.0.1 to ^6.0.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^7.0.1 to ^7.0.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^7.0.2 to ^7.1.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^7.3.0 to ^7.3.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^7.3.1 to ^7.3.2

## [4.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v4.0.4...circleci-deploy-v4.1.0) (2025-01-02)


### Features

* add Cloudsmith auth ([3abc644](https://github.com/Financial-Times/dotcom-tool-kit/commit/3abc644285cfb01190df4da982c75ffdde22c983))
* add support for Node 22 ([df20e7c](https://github.com/Financial-Times/dotcom-tool-kit/commit/df20e7c455a16eeb3e75a2e940c93848d618a218))
* **cloudsmith:** create plugin to allow us to set cloudsmith options ([9afd7cb](https://github.com/Financial-Times/dotcom-tool-kit/commit/9afd7cb18ddc4774729ab536353bcd6d06b2e4f2))
* **cloudsmith:** move cloudsmith CircleCI config into plugin ([4761b73](https://github.com/Financial-Times/dotcom-tool-kit/commit/4761b73b514dc2b7b03df5f8de2934509f3ba6d1))
* remove npm engine field ([aec1c78](https://github.com/Financial-Times/dotcom-tool-kit/commit/aec1c78aedb8f26a43b25824eb19e30101806182))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^7.2.0 to ^7.3.0

## [4.0.4](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v4.0.3...circleci-deploy-v4.0.4) (2024-12-12)


### Bug Fixes

* **circleci-deploy:** correct indentation for cypress executor config ([0b5d56c](https://github.com/Financial-Times/dotcom-tool-kit/commit/0b5d56c349de41c68a8bdaeb756aa946b2bbb1e4))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^7.1.0 to ^7.2.0

## [4.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v4.0.0...circleci-deploy-v4.0.1) (2024-09-16)


### Bug Fixes

* **circleci:** remove leftover references to deleted waiting-for-approval ([4ed4634](https://github.com/Financial-Times/dotcom-tool-kit/commit/4ed46345c88e5e85ae29472605f29b9ab3383772))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^7.0.0 to ^7.0.1

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v3.4.5...circleci-deploy-v4.0.0) (2024-09-10)


### ⚠ BREAKING CHANGES

* **pa11y:** remove deprecated plugin
* **circleci:** define CircleCI configs in .toolkitrc.yml
* drop support for Node 16
* move base classes into their own package
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* **circleci-deploy:** define Cypress and Serverless options with tags ([6ee5f3c](https://github.com/Financial-Times/dotcom-tool-kit/commit/6ee5f3cf309a87723c19802fd00dd5b2a991313a))
* **circleci:** define CircleCI configs in .toolkitrc.yml ([16f8538](https://github.com/Financial-Times/dotcom-tool-kit/commit/16f853804e728dfc84398d2311f6059076b1aeea))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* **pa11y:** remove deprecated plugin ([dd755f8](https://github.com/Financial-Times/dotcom-tool-kit/commit/dd755f878bb71239d91a04a1095d75d0c78c32f7))


### Bug Fixes

* **circleci-deploy:** add missing Serverless options to deploy-review job ([733b182](https://github.com/Financial-Times/dotcom-tool-kit/commit/733b18218bc082d4bba62dc763d7ed7db9313134))
* **circleci-deploy:** remove unused option from e2e-test-review job ([530a687](https://github.com/Financial-Times/dotcom-tool-kit/commit/530a687a074ccd0b1733fef379935629aba68bac))
* **circleci:** don't run review jobs on tagged releases ([f373212](https://github.com/Financial-Times/dotcom-tool-kit/commit/f373212518183be7841205a6aed7c0c5a96ef747))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove all current concrete hook subclasses ([62e7dc6](https://github.com/Financial-Times/dotcom-tool-kit/commit/62e7dc6d953efb9fa877143e77707cccee25d844))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^6.0.3 to ^7.0.0

## [3.4.5](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v3.4.4...circleci-deploy-v3.4.5) (2024-07-22)


### Bug Fixes

* **circleci:** don't run review jobs on tagged releases ([0e000ce](https://github.com/Financial-Times/dotcom-tool-kit/commit/0e000ce75fda8d3015373e782596ab445970a16d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^6.0.2 to ^6.0.3

## [3.4.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v3.4.1...circleci-deploy-v3.4.2) (2024-02-05)


### Bug Fixes

* **circleci-deploy:** remove unneeded serverless additional fields in TestStaging hook ([1286d7b](https://github.com/Financial-Times/dotcom-tool-kit/commit/1286d7bc62e067bffd5de558921eae1b1fe03964))
* **circleci-deploy:** rename TestStaging job ([9641645](https://github.com/Financial-Times/dotcom-tool-kit/commit/9641645ac92ab3909a8dbb1d5e3bb1ea2663e33d))

## [3.4.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v3.3.0...circleci-deploy-v3.4.0) (2024-01-23)


### Features

* add teardown:review hook ([e00fcb4](https://github.com/Financial-Times/dotcom-tool-kit/commit/e00fcb4739f684ab62329dfe246b4981a9fdebc9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.4.0 to ^5.4.1

## [3.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v3.2.9...circleci-deploy-v3.3.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^5.3.9 to ^5.4.0

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
