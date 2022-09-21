# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.3.0 to ^2.4.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.5.0 to ^2.5.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.5.1 to ^2.6.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.6.0 to ^2.6.1

### [0.3.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/pa11y-v0.3.2...pa11y-v0.3.3) (2022-08-11)


### Bug Fixes

* set process.env.TEST_URL to review app name in pa11y ([3128a4b](https://github.com/Financial-Times/dotcom-tool-kit/commit/3128a4bd938ac86a5a96fa6f3d893ddb73434995))

### [0.3.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/pa11y-v0.3.1...pa11y-v0.3.2) (2022-08-09)


### Bug Fixes

* **pa11y:** resolve path to pa11y-ci binary ([763ec14](https://github.com/Financial-Times/dotcom-tool-kit/commit/763ec147f635d427be467531bde3f651ec93d55e))

## [0.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/pa11y-v0.2.1...pa11y-v0.3.0) (2022-07-27)


### ⚠ BREAKING CHANGES

* **pa11y:** Instead of passing static options to Pa11y, calling the pa11y-ci binary instead reads config defined in a .pa11yci[.js[on]] file. Seeing as this can be a .js file, the config can be dynamically generated, making the tooling much more flexible. This was how n-gage interfaced with Pa11y.

### Features

* **pa11y:** allow Pa11y to use config defined in .pa11yci ([cf0908c](https://github.com/Financial-Times/dotcom-tool-kit/commit/cf0908c7963e802cfedb955da36607c976aa57dd))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.4.0 to ^2.5.0

## [0.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/pa11y-v0.1.3...pa11y-v0.2.0) (2022-07-12)


### ⚠ BREAKING CHANGES

* **pa11y:** remove Pa11y task from staging test hook

### Bug Fixes

* **pa11y:** remove Pa11y task from staging test hook ([dea7d5a](https://github.com/Financial-Times/dotcom-tool-kit/commit/dea7d5a61dcc7cde81e6c09fd44667b339948cbf))

## [0.1.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/pa11y-v0.1.2...pa11y-v0.1.3) (2022-06-23)


### Bug Fixes

* **pa11y:** add suggestion to error messages and fix typos ([e2c2eaa](https://github.com/Financial-Times/dotcom-tool-kit/commit/e2c2eaa54f1597f770fb6dc54e0fdfc6db9b9ba0))
* **pa11y:** use proper Heroku domain when testing review apps ([4c75752](https://github.com/Financial-Times/dotcom-tool-kit/commit/4c757522f0560719e7280ddd6ff20ff4a508179b))
