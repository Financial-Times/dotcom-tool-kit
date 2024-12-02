import { z } from 'zod'

export const NodeSchema = z
  .object({
    entry: z.string().default('./server/app.js').describe('path to the node application'),
    args: z.string().array().optional().describe('additional arguments to pass to your application'),
    useDoppler: z
      .boolean()
      .default(true)
      .describe('whether to run the application with environment variables from Doppler'),
    ports: z
      .union([z.number().array(), z.literal(false)])
      .default([3001, 3002, 3003])
      .describe(
        "ports to try to bind to for this application. set to `false` for an entry point that wouldn't bind to a port, such as a worker process or one-off script."
      ),
    watch: z
      .boolean()
      .optional()
      .describe(
        'run Node in watch mode, which restarts your application when the entrypoint or any imported files are changed. **nb** this option is experimental in Node v18 and v20.'
      )
  })
  .describe('Run a Node.js application for local development.')

export type NodeOptions = z.infer<typeof NodeSchema>

export const Schema = NodeSchema
