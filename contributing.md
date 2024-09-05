# Contributing

Tool Kit is organised as a monorepo with all the different plugins and libraries stored in a single repository. This allows us to quickly investigate and make changes across the whole codebase, as well as making installation easier by sharing dependencies. See the [developer documentation](./docs/developing-tool-kit.md) for a full explanation of the internal architecture of Tool Kit.

Release versions are not kept in sync between the packages, as we do not want to have to a major version bump for every package whenever we release a breaking change for a single package.

We use [release-please](https://github.com/googleapis/release-please) to manage releases and versioning. Every time we make a merge to main, release-please checks which packages have been changed, and creates a PR to make new releases for them. It uses the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard to determine whether updates require a patch, minor, or major version bump, and we use [commitlint](https://commitlint.js.org) to enforce the standard in all of our commits.

This means you should make an effort to think carefully about whether the changes you're making are a new feature or bug fix, and whether they contain any breaking changes. This might seem burdensome at first but it's good practice to make sure you can predict whether other teams' builds are going to break because of your code changes! If your commit will only affect a single package then please also include the name of the package (without the `@dotcom-tool-kit` namespace) in the scope of your commit message, as this makes it easier to see where changes are being made just by a quick glance at the git log. For example, a commit message for a new feature for the `circleci` plugin might look like:

```
feat(circleci): add support for nightly workflows
```

Note that new plugins should be created with a version number of `0.1.0`. This indicates that the package is still in the early stages of development and could be subject to many breaking changes before it's stabilised. Committing breaking changes whilst your package is `<1.0.0` are treated as minor bumps (`0.2.0`) and both new features and bug fixes as patch bumps (`0.1.1`.) When you're ready, you can release a 1.0 of your plugin by including `Release-As: 1.0.0` in the body of the release commit.
