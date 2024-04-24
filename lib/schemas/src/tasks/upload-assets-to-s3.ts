import { z } from 'zod'

export const UploadAssetsToS3Schema = z.object({
  accessKeyIdEnvVar: z
    .string()
    .default('AWS_ACCESS_HASHED_ASSETS')
    .describe(
      "variable name of the project's aws access key id. If uploading to multiple buckets the same credentials will need to work for all"
    ),
  secretAccessKeyEnvVar: z
    .string()
    .default('AWS_SECRET_HASHED_ASSETS')
    .describe("variable name of the project's aws secret access key"),
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
