# Migrating to Tool Kit from n-gage

## Introduction

Tool Kit is our suite of developer tooling for FT.com applications and
components. Tool Kit is designed to handle all parts of your workflow, from
building to testing to deploying. You can read more about the structure and
philosophy of Tool Kit in the [README](../README.md).

Previously, [n-gage](https://github.com/Financial-Times/n-gage) was the main
tool used in the FT to orchestrate projects, and Tool Kit has been designed as
its replacement. This migration guide focuses on how to migrate from n-gage to
Tool Kit and so will give analogies and guidance based on it. Therefore, this
text is recommended only for projects already using n-gage, though it _may_ help
push you in the right direction if you're creating a fresh, new project.

## The Migration Tool

We have created an interactive tool that will hopefully automate most of the
dull refactoring required to hook up your project with Tool Kit. The tool tries
to be as transparent about what it's doing as possible so should be easy enough
to follow along with.

The migration tool is published to npm as `@dotcom-tool-kit/create`. Thanks to
some [syntax sugar
magic](https://docs.npmjs.com/cli/v7/commands/npm-init#description) provided by
npm's `npm init` script this means you can just run

```shell
npm init @dotcom-tool-kit
```

within your repository to fetch the tool and start migrating. Answer the
questions posed by the tool's prompts to configure Tool Kit in a way that's
suitable for your app or service. Let's now look in detail at each of the steps
in the migration process.

## Step-By-Step

The Tool Kit migration tool will ask you a series of questions about your
project and how much you want to immediately migrate. Let's copy each prompt
here and break down what they mean, why we need it, and what it will do. Note
that you might not see all these prompts in your particular run depending on how
complex the migration is.

### What Kind Of App?

```
What kind of app is ${app}?
- A user-facing (frontend) app
- A service/backend app
```

The first question is key! Here you choose what kind of app you're migrating,
which will dictate many of the plugins that will be pulled in. Frontend apps
will use build tools like Webpack to bundle their code for the browser whilst
backend apps and services might use node and npm. These plugins are all bundled
up in a 'compilation' plugin called something like
`@dotcom-tool-kit/frontend-app` whose sole job is to list a set of other plugins
to include.

### Plugins

```
Would you like to install any additional plugins?
- Jest
- Mocha
- ESLint
- Prettier
- lint-staged
```

You are then given the opportunity to add various plugins for other tools you
use in your project. It makes sense to choose all the ones you are already
using, e.g., the `@dotcom-tool-kit/mocha` plugin if you're using Mocha for unit
tests, but now is also a good chance to try out new tools you've been meaning to
integrate into your stack, such as `dotcom-tool-kit/prettier`!

### CircleCI Config

```
Would you like a CircleCI config to be generated? This will overwrite the current config at .circleci/config.yml.
```

Tool Kit provides a CircleCI orb to call the CI hooks for PRs and deployments.
It's recommended that you delete your old CircleCI config and let Tool Kit
generate a new one for you that will use the Tool Kit orb for all of the
different workflows you'd typically expect in a project. If you have a workflow
that is a little atypical then you will be free to add those in after the file
has been generated (you'll want to make sure you remove the automated header
comment at the top of the file so that your changes aren't overwritten in the
future.) Feel free to peruse the [source
code](https://github.com/Financial-Times/dotcom-tool-kit/tree/HEAD/orb/src) and
the
[documentation](https://circleci.com/developer/orbs/orb/financial-times/dotcom-tool-kit)
to see the inner workings of the orb.

### Deleting n-gage

```
Should we uninstall obsolete n-gage and n-heroku-tools packages?
```

n-gage and n-heroku-tools have now been replaced by Tool Kit and shouldn't be
required any more so we suggest you delete them from your `package.json`. You
may, however, opt to keep them for now if there are some esoteric tasks that
they're handling that Tool Kit doesn't support yet (please let the platforms
team know if you're having to do this on the
[#cp-platforms-team](https://financialtimes.slack.com/archives/C3TJ6KXEU) Slack
channel so we can fill in that gap!)

### Confirmation and Installation

```
so, we're gonna:

install the following packages:
- ${package 1}
- ${package 2}

uninstall the following packages:
- ${package 3}
- ${package 4}

create a .toolkitrc.yml containing:
${config contents}

regenerate .circleci/config.yml

sound good?
```

You'll be given an opportunity to review and confirm the changes you're making
before executing them. If you do confirm them then the following will happen
(skipping the steps you've not enabled):

1. Your `package.json` will be modified with the listed packages
   installed/uninstalled
2. `npm install` will be run to update your `node_modules` and
   `package-lock.json` (if applicable) with the npm changes
3. The `.toolkitrc.yml` configuration file will be written listing the plugins
   you've selected
4. Deleting your old CircleCI configuration file ready to have a new one
   regenerated
5. Run `npx dotcom-tool-kit --install`. This command calls an `install` method
   that's defined for each hook, which will handle the logic to slot the hook
   into the place it's meant to 'hook' into, e.g., installing npm hooks into the
   `scripts` property in the `package.json`. (This is also where the CircleCI
   config is regenerated to insert the appropriate CI hooks.)

Sometimes the final step will fail, but this usually indicates that there are
some ambiguities in your configuration that can be clarified in the subsequent steps.

### Task Conflicts

```
Hook ${hook} has multiple tasks configured for it.
Please select the 1st package to run.
- ${task 1}
- ${task 2}
- finish
```

In some projects you will find multiple tasks are configured to use the same
hook. A common example would be the `@dotcom-tool-kit/eslint` and
`@dotcom-tool-kit/mocha` plugins, which both define tasks that use the
`test:local` hook. Tool Kit does not assume the order you want those to run, as
in some cases one of the tasks might depend on the other, so you need to declare
the order explicitly. This is expanded on in its own [documentation
page](./resolving-hook-conflicts.md), but the migration tool takes you through
the process. You choose each task in the order you want them to run in. If you
don't want some of the tasks to be included in the hook at all, just select the
`finish` option after the rest of the tasks have been selected and the remainder
won't be run.

### Setting Options

```
Please now configure the options for the ${plugin} plugin.
Set a value for '${option}'
```

Some plugins require configuration to work, whereas others might have optional
settings that you may want to tweak. You must set all the required options to
continue, though naturally the optional ones may be skipped. These options will
be added to your `.toolkitrc`. In the future, we will add support for default
values in the migration tool (they are already available within Tool Kit
itself,) so that for most cases you could accept default values, even for fields
that are required. Some plugins will have specially-made prompts to allow
setting options for more complex scenarios, such as the Heroku plugin which
prompts you to fill in scaling information for each app you have in your
project's Heroku pipeline.

### Migrating Your Makefile

```
We recommend deleting your old Makefile as it will no longer be used. In the
future you can run tasks with 'npm run' instead. Make sure that you won't be
deleting any task logic that hasn't already been migrated to Tool Kit. If you
find anything that can't be handled by Tool Kit then please let the Platforms
team know.

We've found some targets in your Makefile which could be migrated to Tool Kit:
- Your ${makefile target} target is likely handled by the ${target} hook in Tool Kit

We don't know if these other Makefile targets can be migrated to Tool Kit.
Please check what they're doing:
- ${makefile target}
- ${makefile target}
```

Finally, the tool will give guidance on what the do with the Makefile in your
project that was integrated with n-gage. It will try and recommend equivalent
hooks based on the name of the targets within the Makefile (the `test:local`
hook for a `test` target, for example,) but sometimes you'll want to leave some
of the targets in at the beginning of the migration and gradually transition
everything over to Tool Kit. Regardless, this step just provides some
suggestions and the migration tool doesn't perform any actions so you'll need to
delete the Makefile yourself if you don't think it's needed anymore. Remember
that – assuming you didn't delete it in the earlier step – some of the `make`
commands come from `n-gage` itself and won't necessarily be in the Makefile,
such as `make install`.

## Migrating Your Heroku Pipeline

One thing that the migration tool cannot automate is reconfiguring your Heroku
pipeline to integrate properly with Tool Kit. You will need to ensure that your
pipeline is connected to the project's GitHub repository, that PRs create review
apps, and commits to main deploy from a staging app. This might be how your
pipeline was already configured, but you should check to make sure that
automatic deployments are still working, and try reconnecting to GitHub if they
are not. A step-by-step guide with screenshots can be found
[here](https://docs.google.com/document/d/1b7WlRfhiWlbDsSSGP3TllYaGMJbx9nCdAtcr8_OWEWM).
