# Jobs

Easily author and add [Parameterized Jobs](https://circleci.com/docs/reference/reusing-config/#authoring-parameterized-jobs) to the `src/jobs` directory.

Each _YAML_ file within this directory will be treated as an orb job, with a name which matches its filename.

Jobs may invoke orb commands and other steps to fully automate tasks with minimal user configuration.

Here's an example of a job:

```yaml
  # What will this job do?
  # Descriptions should be short, simple, and clear.
  Sample description
executor: default
parameters:
  greeting:
    type: string
    default: "Hello"
    description: "Select a proper greeting"
steps:
  - greet:
      greeting: << parameters.greeting >>
```

## See:
 - [Introduction to authoring orbs](https://circleci.com/docs/orb-author/)
 - [Authoring parameterized jobs](https://circleci.com/docs/reference/reusing-config/#authoring-parameterized-jobs)
 - [Node Orb "test" Job](https://github.com/CircleCI-Public/node-orb/blob/master/src/jobs/test.yml)
