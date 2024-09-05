import { z } from 'zod'

export const UploadAssetsToS3Schema = z
  .object({
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
    directory: z
      .string()
      .default('public')
      .describe('the folder in the project whose contents will be uploaded to S3'),
    reviewBucket: z
      .string()
      .array()
      .default(['ft-next-hashed-assets-preview'])
      .describe('the development or test S3 bucket'),
    prodBucket: z
      .string()
      .array()
      .default(['ft-next-hashed-assets-prod'])
      .describe(
        "production S3 bucket(s). The same files will be uploaded to each. **Note**: most Customer Products buckets that have a `prod` and `prod-us` version are already configured in AWS to replicate file changes from one to the other so you don't need to specify both here. Also, if multiple buckets are specified the same credentials will need to be valid for both for the upload to be successful."
      ),
    region: z
      .string()
      .default('eu-west-1')
      .describe(
        'the AWS region your buckets are stored in (let the Platforms team know if you need to upload to multiple buckets in multiple regions).'
      ),
    destination: z
      .string()
      .default('hashed-assets/page-kit')
      .describe(
        "the destination folder for uploaded assets. Set to `''` to upload assets to the top level of the bucket"
      ),
    extensions: z
      .string()
      .default('js,css,map,gz,br,png,jpg,jpeg,gif,webp,svg,ico,json')
      .describe('file extensions to be uploaded to S3'),
    cacheControl: z
      .string()
      .default('public, max-age=31536000, stale-while-revalidate=60, stale-if-error=3600')
      .describe(
        'header that controls how long your files stay in a CloudFront cache before CloudFront forwards another request to your origin'
      )
  })
  .describe('Upload files to an AWS S3 bucket.')

export type UploadAssetsToS3Options = z.infer<typeof UploadAssetsToS3Schema>

export const Schema = UploadAssetsToS3Schema
