import { z } from 'zod'

export const NodemonSchema = z
  .object({
    entry: z.string().default('./server/app.js').describe('path to the node application'),
    configPath: z
      .string()
      .optional()
      .describe(
        "path to a Nodemon config file. defaults to Nodemon's [automatic config resolution](https://github.com/remy/nodemon#config-files)."
      ),
    useDoppler: z
      .boolean()
      .default(true)
      .describe('whether to run the application with environment variables from Doppler'),
    ports: z
      .union([z.number().array(), z.literal(false)])
      .default([3001, 3002, 3003])
      .describe(
        "ports to try to bind to for this application. set to `false` for an entry point that wouldn't bind to a port, such as a worker process or one-off script."
      )
  })
  .describe('Run an application with `nodemon` for local development.')

export type NodemonOptions = z.infer<typeof NodemonSchema>

export const Schema = NodemonSchema
