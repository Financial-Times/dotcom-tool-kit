# Changelog

## [1.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/plugin-v1.0.0...plugin-v1.1.0) (2025-02-17)


### Features

* allow option schemas to be loaded from plugins ([58310c8](https://github.com/Financial-Times/dotcom-tool-kit/commit/58310c88077e332473b36dacf142881f20700c2a))
* support special case of root plugin option schema ([b6b5edb](https://github.com/Financial-Times/dotcom-tool-kit/commit/b6b5edb2be5bd16b2b44d5f46288dc19c4b3e6a1))

## 1.0.0 (2024-09-10)


### ⚠ BREAKING CHANGES

* only load plugins if their toolkitrc version matches the current version
* load hook installations from options.hooks
* move plugin options to a sub key of toolkitrc options entries

### Features

* add support for a managesFiles entry in hook installs fields ([a89b167](https://github.com/Financial-Times/dotcom-tool-kit/commit/a89b167da9dae6edd6fcc9295a5f8f82e2e30023))
* allow specifying command task options in a toolkitrc ([7b8bc00](https://github.com/Financial-Times/dotcom-tool-kit/commit/7b8bc000b8562eb0dbd00eb2f8f3fc5fab71a57b))
* load hook installations from options.hooks ([aaf1160](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaf1160a4724b07b9d174f9d237721368d2fa087))
* load plugin rcfile task options into config ([3f1b1b1](https://github.com/Financial-Times/dotcom-tool-kit/commit/3f1b1b149e9e5c9c0d00b7f85697469b0ece472a))
* move plugin options to a sub key of toolkitrc options entries ([4748eb1](https://github.com/Financial-Times/dotcom-tool-kit/commit/4748eb12d60bef31bd6da00d1447e35af1e0af1a))
* only load plugins if their toolkitrc version matches the current version ([65b3403](https://github.com/Financial-Times/dotcom-tool-kit/commit/65b3403b8369aa09ec64b11d20ab44b06d468d86))
* split remaining bits of types into config and plugins packages ([6cde9b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cde9b90d4cd02383ae1b18ca38e0843e6c3d3ab))
