# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.4 to ^1.1.5
    * @dotcom-tool-kit/logger bumped from ^4.1.0 to ^4.1.1
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.6.0 to ^1.6.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.6 to ^1.1.7
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.6.2 to ^1.7.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.8 to ^1.1.9
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.8.0 to ^1.9.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.2.0 to ^1.2.1
    * @dotcom-tool-kit/logger bumped from ^4.1.1 to ^4.2.0

## [0.4.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/docker-v0.3.3...docker-v0.4.0) (2025-03-03)


### ⚠ BREAKING CHANGES

* adopt standard labels for container images

### Features

* adopt standard labels for container images ([24edde4](https://github.com/Financial-Times/dotcom-tool-kit/commit/24edde4a5e76d27eb7bb9757550bac56a59353b5))


### Bug Fixes

* use the standard "Financial Times" vendor ([674bdb4](https://github.com/Financial-Times/dotcom-tool-kit/commit/674bdb48561c20ab6008a29f5c5c926dfb837798))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.10 to ^1.2.0

## [0.3.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/docker-v0.3.2...docker-v0.3.3) (2025-02-17)


### Features

* move plugin options schemas into plugins ([f0b482b](https://github.com/Financial-Times/dotcom-tool-kit/commit/f0b482bc89c1728aebc96b78aed68e4a15d0f8dc))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.9 to ^1.1.10

## [0.3.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/docker-v0.3.1...docker-v0.3.2) (2025-02-14)


### Bug Fixes

* use a new "docker" state for pushed images ([b0b9350](https://github.com/Financial-Times/dotcom-tool-kit/commit/b0b9350128faa5a2eef644a264da527c39fd93f5))
* use nullish coalescing operators ([85510f5](https://github.com/Financial-Times/dotcom-tool-kit/commit/85510f583f1cd6b4c80908c3f26b5bb249384249))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/state bumped from ^4.3.0 to ^4.3.1

## [0.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/docker-v0.2.4...docker-v0.3.0) (2025-02-04)


### ⚠ BREAKING CHANGES

* move docker auth to a new task

### Features

* move docker auth to a new task ([441dc13](https://github.com/Financial-Times/dotcom-tool-kit/commit/441dc13adf1b722dfa5f86c51f79cff73f066932))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.7 to ^1.1.8
    * @dotcom-tool-kit/state bumped from ^4.2.0 to ^4.3.0
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.7.0 to ^1.8.0

## [0.2.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/docker-v0.2.2...docker-v0.2.3) (2025-01-27)


### Features

* store pushed Docker images in state ([ade6eba](https://github.com/Financial-Times/dotcom-tool-kit/commit/ade6eba1f9c76796936f8d6aae66687a55578555))


### Bug Fixes

* allow building ARM64 images in AMD CI jobs ([9944ffe](https://github.com/Financial-Times/dotcom-tool-kit/commit/9944ffe706c36baa476af017de3e953e1240b27d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/state bumped from ^4.1.0 to ^4.2.0

## [0.2.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/docker-v0.2.1...docker-v0.2.2) (2025-01-16)


### Features

* **docker:** read ci build info from state instead of using env vars directly ([599bc16](https://github.com/Financial-Times/dotcom-tool-kit/commit/599bc1627a9223473443d7facb10e493746bfaae))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.5 to ^1.1.6
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.6.1 to ^1.6.2

## [0.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/docker-v0.1.0...docker-v0.2.0) (2025-01-09)


### ⚠ BREAKING CHANGES

* **docker:** build on arm64 by default

### Features

* **docker:** build on arm64 by default ([ff4fa5d](https://github.com/Financial-Times/dotcom-tool-kit/commit/ff4fa5defbd3e726de44275d2dbf82bf006f27f4))
* tweak docker labels ([90ec26a](https://github.com/Financial-Times/dotcom-tool-kit/commit/90ec26aeb37a1607eaf576cda92e08623f15e94d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.3 to ^1.1.4
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.5.0 to ^1.6.0

## 0.1.0 (2025-01-08)


### Features

* add a docker plugin ([d8a7024](https://github.com/Financial-Times/dotcom-tool-kit/commit/d8a7024da1e688116ead8995349342e51d450e9f))
* tag images with git info ([ec9f3b3](https://github.com/Financial-Times/dotcom-tool-kit/commit/ec9f3b36c57289514ec5dca97a34f2dcaf75241e))


### Bug Fixes

* match all unsanitary characters ([a08b3f6](https://github.com/Financial-Times/dotcom-tool-kit/commit/a08b3f6189df213f5525b1892c567f8e91aaf142))
* support Node.js 22 ([b37bf02](https://github.com/Financial-Times/dotcom-tool-kit/commit/b37bf02904340ed7b4a41fabd2b0cd37ba52ac08))
* use kebab-case for process names ([efa437c](https://github.com/Financial-Times/dotcom-tool-kit/commit/efa437caf7ba13ebec93aff87ef97f5e83e7553f))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.2 to ^1.1.3
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.4.0 to ^1.5.0
