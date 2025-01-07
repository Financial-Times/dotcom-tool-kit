import { z } from 'zod'

export const NodeTestSchema = z
  .object({
    concurrency: z
      .number()
      .int()
      .or(z.boolean())
      .default(false)
      .describe('The number of tests to run in parallel. See https://nodejs.org/api/test.html#runoptions'),
    files: z
      .string()
      .array()
      .optional()
      .describe('The glob patterns for test files'),
    ignore: z
      .string()
      .array()
      .default([])
      .describe('Glob patterns for test files to ignore'),
    forceExit: z
      .boolean()
      .default(false)
      .describe('Whether to force exit the process once all tests have finished executing')
  })
  .describe('Runs the built-in Node.js test runner to execute tests.')

export type NodeTestOptions = z.infer<typeof NodeTestSchema>

export const Schema = NodeTestSchema
