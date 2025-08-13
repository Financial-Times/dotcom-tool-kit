# Migration guide for @dotcom-tool-kit/containerised-app-with-assets

This document outlines how to migrate to newer versions of the `containerised-app-with-assets` plugin. This plugin uses the `containerised-app` plugin as a base layer. Throughout this guide we use the following emoji and labels to indicate the level of change required:

Emoji           | Label             | Meaning
----------------|:------------------|:-------
🔴   | Breaking          | A breaking change which will likely require code or config changes to resolve
🟠 | Possibly Breaking | A breaking change that is unlikely to require code changes but things outside of the code (e.g. logs) may have changed

## Migrating from v0.2.x to v0.3.x

### New default review environment

**🔴 Breaking:** Please refer to the `@dotcom-tool-kit/containerised-app` [migration guide](../containerised-app/migration.md) for instructions on how to leverage the new environment.
