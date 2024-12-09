# Changelog

## [1.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/base-v1.0.0...base-v1.1.0) (2024-12-09)


### Features

* pass config into taskruncontext ([435ffbc](https://github.com/Financial-Times/dotcom-tool-kit/commit/435ffbc74a81bdd159d4ea01943c6614ed1d3471))
* pass current command into task run context ([e4cf21c](https://github.com/Financial-Times/dotcom-tool-kit/commit/e4cf21c8c4e502b02918736b8b127097dba27572))
* pass task cwd through via TaskRunContext ([b12fe30](https://github.com/Financial-Times/dotcom-tool-kit/commit/b12fe30916e99e157e131a99fca6c59960b89f3a))


### Bug Fixes

* freeze the config before passing it into tasks ([a0283b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/a0283b9b5a48314a26ce04ce4c176ab5f4aacc07))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/validated bumped from ^1.0.0 to ^1.0.1
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.0.2 to ^1.0.3
    * @dotcom-tool-kit/logger bumped from ^4.0.0 to ^4.0.1

## 1.0.0 (2024-09-10)


### ⚠ BREAKING CHANGES

* pass task files in as part of a run context object
* rename Task#options to pluginOptions
* move base classes into their own package

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* split remaining bits of types into config and plugins packages ([6cde9b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cde9b90d4cd02383ae1b18ca38e0843e6c3d3ab))


### Code Refactoring

* pass task files in as part of a run context object ([5aa7327](https://github.com/Financial-Times/dotcom-tool-kit/commit/5aa7327018c0a87c8c9feef36ef9e3735a4f5e6d))
* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/logger bumped from ^3.3.0 to ^4.0.0
