import { z } from 'zod'

export const UploadAssetsToS3Schema = z.object({
  accessKeyIdEnvVar: z.string().optional(),
  secretAccessKeyEnvVar: z.string().optional(),
  accessKeyId: z.string().optional(), // @deprecated: use accessKeyIdEnvVar instead
  secretAccessKey: z.string().optional(), // @deprecated: use secretAccessKeyEnvVar instead
  directory: z.string(),
  reviewBucket: z.string().array(),
  prodBucket: z.string().array(),
  region: z.string(),
  destination: z.string(),
  extensions: z.string(),
  cacheControl: z.string()
})
export type UploadAssetsToS3Options = z.infer<typeof UploadAssetsToS3Schema>

export const Schema = UploadAssetsToS3Schema
