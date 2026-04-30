# Commands

Easily add and author [Reusable Commands](https://circleci.com/docs/reference/reusing-config/#authoring-reusable-commands) to the `src/commands` directory.

Each _YAML_ file within this directory will be treated as an orb command, with a name which matches its filename.

Here's an example of a command:

```yaml
description: >
  Replace this text with a description for this command.
  # What will this command do?
  # Descriptions should be short, simple, and clear.
parameters:
  greeting:
    type: string
    default: "Hello"
    description: "Select a proper greeting"
steps:
  - run:
      name: Hello World
      command: echo << parameters.greeting >> world
```

## See:
 - [Introduction to authoring orbs](https://circleci.com/docs/orb-author/)
 - [Authoring reusable commands](https://circleci.com/docs/reference/reusing-config/#authoring-reusable-commands)
