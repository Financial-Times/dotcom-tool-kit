# Changelog

## 1.0.0 (2024-04-30)


### ⚠ BREAKING CHANGES

* only load plugins if their toolkitrc version matches the current version
* load hook installations from options.hooks
* move plugin options to a sub key of toolkitrc options entries

### Features

* add support for a managesFiles entry in hook installs fields ([e0e9b05](https://github.com/Financial-Times/dotcom-tool-kit/commit/e0e9b055decf3b0ca39caf49de7931f444b9f505))
* allow specifying command task options in a toolkitrc ([bb091c8](https://github.com/Financial-Times/dotcom-tool-kit/commit/bb091c8d78ee8e71441c51da3f2e9a8d273ffeee))
* load hook installations from options.hooks ([2f0c2b6](https://github.com/Financial-Times/dotcom-tool-kit/commit/2f0c2b68e6668fdbcc14c88458243f7377eefe39))
* load plugin rcfile task options into config ([e749170](https://github.com/Financial-Times/dotcom-tool-kit/commit/e749170d67a82064d205b7304b536c6c06a633c5))
* move plugin options to a sub key of toolkitrc options entries ([9eaa9b0](https://github.com/Financial-Times/dotcom-tool-kit/commit/9eaa9b0475a471769d5b86fe103139aadfd6e8a6))
* only load plugins if their toolkitrc version matches the current version ([3c98760](https://github.com/Financial-Times/dotcom-tool-kit/commit/3c987609092a629e3000b43f8c5fdb4592ffc789))
* split remaining bits of types into config and plugins packages ([ee5839b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ee5839b7ac6a9fc8321beb8a7503f624aabf15b7))
