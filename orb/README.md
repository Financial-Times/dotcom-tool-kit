# Dotcom Tool Kit Orb

An orb exporting many standard hooks as jobs to add to your CircleCI config.

## Job Structure

Each job is a very simple wrapper that calls its respective hook, where most of the real logic is contained. For example, the `build` job is defined in its entirety as:

```yaml
parameters:
  node-version:
    default: '16.14'
    type: string

executor:
  name: node/default
  tag: <<parameters.node-version>>

steps:
  - attach-workspace
  - run:
      name: Run the project build-production task
      command: npx dotcom-tool-kit build:ci
```

You can expect any other given job to look very similar. We first define a parameter that allows consumers to set the version of node to use with the `node-version` parameter as a property added to the `build` job. We then use this parameter to pull in an appropriately versioned copy of the node docker image using the `executor` property. We run `attach-workspace`, which is the glue we use in many jobs to pick up the state from a previous job in the workflow, now rolled into a simple command (along with its counterpart `persist-workspace`.) Finally, we run the `build:ci` hook event, which will run any hooks for building the project in the CI, such as babel, webpack, etc.

## Adding Jobs To Your CircleCI Config

#### Automatically

The easiest way to use the dotcom-tool-kit orb is to delete your old `.circleci/config.yml` file, then run `npx dotcom-tool-kit --install`. This will automatically generate a config file that will include all the hooks you have installed. If you add or remove plugins be sure to rerun `npx dotcom-tool-kit --install` to update the CircleCI jobs in lockstep.

#### Manually

Alternatively, you can manually add tool-kit jobs to your CircleCI just like you would any other job, but it will look a lot terser! Take using the `heroku-provision` job in `next-static`:

```yaml
- tool-kit/heroku-provision:
    requires:
      - tool-kit/setup
    filters:
      branches:
        ignore: /(^renovate-.*|^nori/.*|^main)/
```

You can see that the job itself requires no additional parameters, and the only configuration required are the properties used to place the job into your own workflow, using the `requires` property to say that the job is run after `tool-kit/setup`, and the `filters` property to say the job should only be run in PR branches (excluding nori and Renovate branches.) Note that all the job names have been prefixed with `tool-kit/`. This is because we need to add one extra stanza at the top of your config file in order to pull in the dotcom tool kit orb:

<!--- TODO: generate README on release to fill in orb version automatically --->

```yaml
orbs:
  tool-kit: financial-times/dotcom-tool-kit@<orb-version>
```

substituting in the latest orb version.
