# @dotcom-tool-kit/hako

## Installation & Usage

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/hako
```

And add it to your repo's `.toolkitrc.yml`:

```yml
plugins:
  - '@dotcom-tool-kit/hako'
```

<!-- begin autogenerated docs -->
## Tasks

### `HakoDeploy`

Deploy to ECS via the Hako CLI
#### Task options

| Property                  | Description                                                                                                                                                                 | Type            | Default |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------- | :------ |
| `asReviewApp`             | whether to deploy as a temporary review app, used for code review. overrides the `customEphemeralId` option with its own hash of the git branch.                            | `boolean`       | `false` |
| `customEphemeralId`       | ID that is used by Hako to identify a particular ephemeral app                                                                                                              | `string`        |         |
| `customEphemeralManifest` | path to another app.yaml manifest used to set custom parameters for an ephemeral app. if not set the manifest from the default path for the given environment will be used. | `string`        |         |
| **`environments`** (\*)   | the Hako environments to deploy an image to                                                                                                                                 | `Array<string>` |         |

_(\*) Required._

### `HakoDelete`

Remove unneeded ephemeral app
#### Task options

| Property               | Description                                                                                         | Type     |
| :--------------------- | :-------------------------------------------------------------------------------------------------- | :------- |
| **`appName`** (\*)     | name of the app with the ephemeral app to delete (will be the same as the name of the docker image) | `string` |
| **`ephemeralId`** (\*) | ID that is used by Hako to identify a particular ephemeral app                                      | `string` |
| **`environment`** (\*) | the Hako environment the ephemeral app is in                                                        | `string` |

_(\*) Required._
<!-- end autogenerated docs -->
