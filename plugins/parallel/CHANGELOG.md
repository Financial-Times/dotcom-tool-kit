# Changelog

## [1.0.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/parallel-v1.0.1...parallel-v1.0.2) (2025-10-09)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.3.0 to ^1.3.1
  * peerDependencies
    * dotcom-tool-kit bumped from ^4.10.0 to ^4.10.1

## [1.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/parallel-v1.0.0...parallel-v1.0.1) (2025-08-12)


### Bug Fixes

* ensure parallel depends on version of core that exports the internals it needs ([c0c3c2e](https://github.com/Financial-Times/dotcom-tool-kit/commit/c0c3c2e3ccda27161015d75f4a2696f333f01eb9))

## 1.0.0 (2025-08-12)


### Features

* add a Task.stop method and stop parallel tasks on error ([9d33d02](https://github.com/Financial-Times/dotcom-tool-kit/commit/9d33d02e734c04886d7e491e47bdac9f839ed509))
* implement stop method for Parallel itself ([2e62cd6](https://github.com/Financial-Times/dotcom-tool-kit/commit/2e62cd64fe6360627990b870cd62c409d5991eb4))
* **parallel:** configurable stopOnError behaviour ([791e05f](https://github.com/Financial-Times/dotcom-tool-kit/commit/791e05ffe072f9694a25e7b9309215acfc1df7e6))
* run specified tasks in parallel ([a05bc95](https://github.com/Financial-Times/dotcom-tool-kit/commit/a05bc95c7727f4e60ce28ec9273feb1218cca8c3))
* sketch out the parallel task ([88744c4](https://github.com/Financial-Times/dotcom-tool-kit/commit/88744c461612c5edc94209f48bf4a26141c3a8cc))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.2.3 to ^1.3.0
  * peerDependencies
    * dotcom-tool-kit bumped from ^4.8.1 to ^4.10.0
