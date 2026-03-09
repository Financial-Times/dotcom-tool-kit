# Migration guide for @dotcom-tool-kit/containerised-app

This document outlines how to migrate to newer versions of the `containerised-app` plugin. This plugin is also used as the base layer in `containerised-app-with-assets` plugin. Throughout this guide we use the following emoji and labels to indicate the level of change required:

Emoji           | Label             | Meaning
----------------|:------------------|:-------
🔴   | Breaking          | A breaking change which will likely require code or config changes to resolve
🟠 | Possibly Breaking | A breaking change that is unlikely to require code changes but things outside of the code (e.g. logs) may have changed

## Migrating from v0.2.x to v0.3.x

### New default review environment

**🔴 Breaking:** We have created a new **default** Hako environment dedicated to review apps to help us mitigate ALB rule limits issues we were running into in the previous `test` environment. The new environment means we get a new ALB that will now only route traffic to review apps and should free up quota in the staging/test environment. The [migration guide](https://financialtimes.atlassian.net/wiki/spaces/CP/pages/8845393969/Heroku+to+AWS+Migration+Guide) is already updated to reflect how to set up new apps to use the new dedicated review environment. For existing apps on AWS, the migration process is as follows:
1. Update your app to use the latest `v0.3.x` of this plugin - `npm i --save-dev @dotcom-tool-kit/containerised-app@^0.3`
1. If your app bundles assets for the frontend, update the `@dotcom-tool-kit/containerised-app-with-assets` plugin instead to the same version range
1. Copy your `ft-com-test-eu` Hako app manifest (`app.yaml`) to a new `ft-com-review-eu` directory. This will be the configuration for the new `review` environment for your app
1. In the new `review` app manifest, update the top-level `environment` key to `ft-com-review-eu`
1. In a terminal, run `npx dotcom-tool-kit --install` to install new hooks and update your CI config
1. If your app requires secrets in Doppler to function, you will need to set up a secrets sync. Follow the [instructions here](https://financialtimes.atlassian.net/wiki/spaces/CP/pages/8845393969/Heroku+to+AWS+Migration+Guide#Step-2.2%3A-Review-Apps) to do that
1. Deploy your changes and verify that the new review app is now deployed in the `ft-com-review-eu` environment and works correctly
