import { z } from 'zod'

import { type InferSchemaOptions } from './infer'

export const TaskSchemas = {
  'fake schema': z.never()
}

export type TaskOptions = InferSchemaOptions<typeof TaskSchemas>
