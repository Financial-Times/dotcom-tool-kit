import { z } from 'zod'

export const CircleCiCustom = z.record(z.unknown())
export type CircleCiCustom = z.infer<typeof CircleCiCustom>

export const CircleCiExecutor = z
  .object({
    name: z.string(),
    image: z.string()
  })
  .partial()
  .required({ name: true })
export type CircleCiExecutor = z.infer<typeof CircleCiExecutor>

export const CircleCiJob = z
  .object({
    name: z.string(),
    command: z.string(),
    workspace: z
      .object({
        persist: z.boolean().default(true),
        attach: z.boolean().default(true)
      })
      .default({
        persist: true,
        attach: true
      }),
    custom: CircleCiCustom.optional()
  })
  .partial()
  .required({ name: true })
export type CircleCiJob = z.infer<typeof CircleCiJob>

export const CircleCiWorkflowJob = z
  .object({
    name: z.string(),
    requires: z.array(z.string()),
    splitIntoMatrix: z.boolean().optional(),
    runOnRelease: z.boolean().default(true),
    custom: CircleCiCustom.optional()
  })
  .partial()
  .required({ name: true })
export type CircleCiWorkflowJob = z.infer<typeof CircleCiWorkflowJob>

export const CircleCiWorkflow = z
  .object({
    name: z.string(),
    jobs: z.array(CircleCiWorkflowJob),
    runOnRelease: z.boolean().optional(),
    custom: CircleCiCustom.optional()
  })
  .partial()
  .required({ name: true })
export type CircleCiWorkflow = z.infer<typeof CircleCiWorkflow>

export const CircleCiCustomConfig = CircleCiCustom
export type CircleCiCustomConfig = z.infer<typeof CircleCiCustomConfig>

export const CircleCiSchema = z
  .object({
    executors: z
      .array(CircleCiExecutor)
      .optional()
      .describe('an array of additional CircleCI executors to output in the generated config.'),
    jobs: z
      .array(CircleCiJob)
      .optional()
      .describe(
        'an array of additional CircleCI jobs to output in the generated config. these are used for running Tool Kit commands. for running arbitrary shell commands, use `custom`.'
      ),
    workflows: z
      .array(CircleCiWorkflow)
      .optional()
      .describe(
        'an array of additional CircleCI workflows to output in the generated config. these reference jobs defined in the `jobs` option.'
      ),
    custom: CircleCiCustomConfig.optional().describe(
      'arbitrary additional CircleCI configuration that will be merged into the Tool Kit-generated config.'
    ),
    disableBaseConfig: z
      .boolean()
      .optional()
      .describe(
        'set to `true` to omit the Tool Kit CircleCI boilerplate. should be used along with `custom` to provide your own boilerplate.'
      )
  })
  .partial()
  .describe(`This hook automatically manages \`.circleci/config.yml\` in your repo to provide configuration for CircleCI workflows to run Tool Kit commands and tasks.

Options provided in your repository's \`.toolkitrc.yml\` for this hook are merged with any Tool Kit plugin that also provides options for the hook.

Unless they conflict, your options are appended to options from plugins, allowing you to define custom CircleCI jobs and workflows in your repository that work alongside those from plugins.`)

export type CircleCiOptions = z.infer<typeof CircleCiSchema>

export const Schema = CircleCiSchema
