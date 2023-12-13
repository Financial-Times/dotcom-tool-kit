import z from 'zod'

export const BizOpsSystem = z.object({
  hostPlatform: z.string(),
  herokuApps: z.array(z.object({ code: z.string() })),
  awsResourcesAggregate: z.object({ count: z.number() })
})
export type BizOpsSystem = z.infer<typeof BizOpsSystem>
export const BizOpsData = z.object({
  data: z.object({
    systems: z.array(BizOpsSystem).length(1)
  })
})
export type BizOpsData = z.infer<typeof BizOpsData>
