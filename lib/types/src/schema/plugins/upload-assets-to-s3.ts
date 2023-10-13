import { z } from 'zod'

export const UploadAssetsToS3Schema = z.object({
  accessKeyIdEnvVar: z.string().optional(),
  secretAccessKeyEnvVar: z.string().optional(),
  accessKeyId: z.string().default('aws_access_hashed_assets'), // @deprecated: use accessKeyIdEnvVar instead
  secretAccessKey: z.string().default('aws_secret_hashed_assets'), // @deprecated: use secretAccessKeyEnvVar instead
  directory: z.string().default('public'),
  reviewBucket: z.string().array().default(['ft-next-hashed-assets-preview']),
  prodBucket: z.string().array().default(['ft-next-hashed-assets-prod']),
  region: z.string().default('eu-west-1'),
  destination: z.string().default('hashed-assets/page-kit'),
  extensions: z.string().default('js,css,map,gz,br,png,jpg,jpeg,gif,webp,svg,ico,json'),
  cacheControl: z.string().default('public, max-age=31536000, stale-while-revalidate=60, stale-if-error=3600')
})
export type UploadAssetsToS3Options = z.infer<typeof UploadAssetsToS3Schema>

export const Schema = UploadAssetsToS3Schema
