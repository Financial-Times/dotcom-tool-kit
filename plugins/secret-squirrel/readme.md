# @dotcom-tool-kit/secret-squirrel

Tool Kit plugin to run [Secret Squirrel](https://github.com/financial-times/secret-squirrel)

## Installation & Usage

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/secret-squirrel
```

And add it to your repo's `.toolkitrc.yml`:

```yml
plugins:
  - '@dotcom-tool-kit/secret-squirrel
```

You will need a plugin that provides a hook to run the `SecretSquirrel` task. By default, the task runs on the `git:precommit` hook. One plugin that provides that hook is [`husky-npm`](../husky-npm); installing that alongside this plugin will enforce Secret Squirrel running on before every commit. You can also configure Secret Squirrel to run on any other hook; for example, if you want to run it with `npm run test`, you could install the `npm` plugin and manually configure Secret Squirrel to run on `npm`'s `test:local` hook:

```yml
plugins:
  - '@dotcom-tool-kit/secret-squirrel
  - '@dotcom-tool-kit/npm

hooks:
  'test:local': SecretSquirrel
```

## Tasks

| Task | Description | Default hook |
|-|-|
| `SecretSquirrel` | run Secret Squirrel to check for secrets in your repo | `git:precommit` |
