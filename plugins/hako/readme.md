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

| Property                | Description                                                       | Type            | Default |
| :---------------------- | :---------------------------------------------------------------- | :-------------- | :------ |
| `asReviewApp`           | whether to deploy as a temporary review app, used for code review | `boolean`       | `false` |
| **`environments`** (\*) | the Hako environments to deploy an image to                       | `Array<string>` |         |

_(\*) Required._
<!-- end autogenerated docs -->
