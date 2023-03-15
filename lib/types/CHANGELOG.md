# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.1.0 to ^2.1.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.1.1 to ^2.2.0

## [2.9.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v2.9.0...types-v2.9.1) (2023-03-15)


### Bug Fixes

* **types:** allow files options to be simple strings as well as arrays ([3dc32c0](https://github.com/Financial-Times/dotcom-tool-kit/commit/3dc32c041849d8718861fbc0e0d3b72c026804c8))

## [2.9.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v2.8.0...types-v2.9.0) (2023-03-07)


### Features

* add serverless plugin ([2041b7d](https://github.com/Financial-Times/dotcom-tool-kit/commit/2041b7d65c941823f59cbba61b11d32fe67ed906))
* handle default option values with zod ([7c03517](https://github.com/Financial-Times/dotcom-tool-kit/commit/7c0351771cf1a3d795803295a41dfea755176b19))
* **serverless:** define ServerlessProvision task ([6f49aaa](https://github.com/Financial-Times/dotcom-tool-kit/commit/6f49aaa80bb315e5dfd11068a21cb1d3e52ef36a))
* **types:** use Zod for option schemas ([adc1643](https://github.com/Financial-Times/dotcom-tool-kit/commit/adc16437cf0977595b0d0c8b02337b78ee02b2b2))
* validate plugin options with zod ([5164050](https://github.com/Financial-Times/dotcom-tool-kit/commit/5164050869958284611e0fa489551521201e6ac4))


### Bug Fixes

* **types:** allow arbitrary parameters to be passed to CircleCI jobs ([85cc8eb](https://github.com/Financial-Times/dotcom-tool-kit/commit/85cc8ebd9eafbe2de848dfe1c09bb320866910fb))
* **types:** export jest and pa11y schemas that were previously missing ([11e7a1f](https://github.com/Financial-Times/dotcom-tool-kit/commit/11e7a1f30fccf7fc31c71c9867cab4f1754db34f))
* **types:** make sure to export serverless schema type ([69584aa](https://github.com/Financial-Times/dotcom-tool-kit/commit/69584aa4f6f17172bda9714d0155a2517cba4121))
* **types:** use more precise CircleCI configuration interface types ([2e4bf10](https://github.com/Financial-Times/dotcom-tool-kit/commit/2e4bf10157c3c321efd63b14aa5ebb1d38da9550))
* **upload-assets-to-s3:** allow setting region for uploads ([89a984d](https://github.com/Financial-Times/dotcom-tool-kit/commit/89a984db001d6388eada79934d16bb9ad75c98e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.2.0 to ^2.2.1

## [2.8.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v2.7.1...types-v2.8.0) (2023-01-04)


### Features

* **typescript:** add typescript plugin ([0421bdb](https://github.com/Financial-Times/dotcom-tool-kit/commit/0421bdba1f3a56fc8306b8c487433e54b740905c))

## [2.7.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v2.6.2...types-v2.7.0) (2022-12-08)


### Features

* **circleci-heroku:** add support for using a Cypress docker image ([59f914a](https://github.com/Financial-Times/dotcom-tool-kit/commit/59f914aefdb7beae5e8ea0fac314efbc7194d802))
* **circleci:** only print jobs that are missing in error ([c75c3ad](https://github.com/Financial-Times/dotcom-tool-kit/commit/c75c3ad6d91fbc5779d2a3fbed853f474babfad0))
* **cli:** allow state to be shared between install hooks ([aaa5331](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaa533123a48fe9168ec666edeabdd7a8c7428a6))
* **cypress:** add plugin for running cypress locally and in the CI ([870a50b](https://github.com/Financial-Times/dotcom-tool-kit/commit/870a50b107bfa1f1846d35ba074fd3088cc63563))


### Bug Fixes

* **upload-assets-to-s3:** handle AWS keys correctly ([a52db39](https://github.com/Financial-Times/dotcom-tool-kit/commit/a52db39253108cd53494a3cffea043e8e89bdbf7))


### Performance Improvements

* improve lodash tree shaking ([454f9cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/454f9cd9984162141c7318165d723593295db678))

### [2.6.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v2.6.1...types-v2.6.2) (2022-11-09)


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/logger bumped from ^2.1.1 to ^2.1.2

### [2.6.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v2.6.0...types-v2.6.1) (2022-09-21)


### Bug Fixes

* prettier plugin respects .prettierignore ([2a15eab](https://github.com/Financial-Times/dotcom-tool-kit/commit/2a15eab2432cf9b0464bc3c4023f59f136350059))

## [2.6.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v2.5.1...types-v2.6.0) (2022-09-14)


### Features

* deprecate config in favour for options in eslint ([831324a](https://github.com/Financial-Times/dotcom-tool-kit/commit/831324a40df17ca947fc000f51e011a2e79a4f91))
* **node:** allow specifying ports ([20f797a](https://github.com/Financial-Times/dotcom-tool-kit/commit/20f797a9d547863c2e5fd3a40948ec62e575cbf8))
* **node:** make vault optional ([cd12619](https://github.com/Financial-Times/dotcom-tool-kit/commit/cd12619346cfc92d67325c7ec4065a228e414f8c))
* **nodemon:** allow specifying preferred ports ([0aab812](https://github.com/Financial-Times/dotcom-tool-kit/commit/0aab812dfab4eb778c5007eb6ddb2db99a9cc3b2))
* **nodemon:** make vault optional ([9d28d95](https://github.com/Financial-Times/dotcom-tool-kit/commit/9d28d95b7b76fea14741f484d08abc19dc522911))

## [2.5.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v2.4.0...types-v2.5.0) (2022-07-27)


### Features

* **types:** update Pa11y schema type ([8feb5fb](https://github.com/Financial-Times/dotcom-tool-kit/commit/8feb5fb685536805ae188e44c8905c5fe498ba4c))

## [2.4.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v2.3.0...types-v2.4.0) (2022-07-21)


### Features

* add validation errors to compatibility test in types package ([ac118b3](https://github.com/Financial-Times/dotcom-tool-kit/commit/ac118b37bdbb30e062a2d559cc37dc36af4bcb73))
* add validation errors to compatibility test in types package ([5228fab](https://github.com/Financial-Times/dotcom-tool-kit/commit/5228fab26ccee26bd786480bf280f6b91965679f))
* loosen task and hook instance checks ([ac118b3](https://github.com/Financial-Times/dotcom-tool-kit/commit/ac118b37bdbb30e062a2d559cc37dc36af4bcb73))
* loosen task and hook instance checks ([d79b7cf](https://github.com/Financial-Times/dotcom-tool-kit/commit/d79b7cfb5aed68be8b451dd2961f1abe3624c7b9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.0.0 to ^2.1.0

## [2.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v2.2.0...types-v2.3.0) (2022-06-20)


### Features

* **mocha:** allow plugin to pick up .mocharc files ([1ef9fd5](https://github.com/Financial-Times/dotcom-tool-kit/commit/1ef9fd51a50c4a7b53a9655befcb5943838bae97))
* **node:** allow arbitrary arguments to be set for node process ([32cfe94](https://github.com/Financial-Times/dotcom-tool-kit/commit/32cfe946c49236e2170b625f49152f8f30ab1a15))

## [2.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v2.1.0...types-v2.2.0) (2022-06-07)


### Features

* add options to pa11y plugin ([7670db7](https://github.com/Financial-Times/dotcom-tool-kit/commit/7670db7f59e9a798b5fc256182534c5c696f700a))

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v2.0.0...types-v2.1.0) (2022-05-06)


### Features

* **webpack:** add watch mode command for run:local by default ([001a881](https://github.com/Financial-Times/dotcom-tool-kit/commit/001a881c85e5e123cc43075e367c3825c0538d4f))

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/types-v1.9.0...types-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^1.9.0 to ^2.0.0
