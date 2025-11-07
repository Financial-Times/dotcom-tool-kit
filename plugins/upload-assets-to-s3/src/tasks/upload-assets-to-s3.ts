import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import * as fs from 'fs'
import { S3Client, PutObjectCommand, type PutObjectCommandInput } from '@aws-sdk/client-s3'
import path from 'path'
import mime from 'mime'
import { glob } from 'glob'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import * as z from 'zod'

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
export { UploadAssetsToS3Schema as schema }

export default class UploadAssetsToS3 extends Task<{ task: typeof UploadAssetsToS3Schema }> {
  async uploadFile(file: string, s3: S3Client, isReviewApp: boolean): Promise<void> {
    const type = getFileType(file)
    const encoding = getFileEncoding(file)
    const filepath = path.join(this.options.directory, file)
    const body = fs.createReadStream(filepath)
    const key = path.posix.join(this.options.destination, file)

    const bucketByEnv = isReviewApp ? this.options.reviewBucket : this.options.prodBucket
    let currentBucket = ''

    try {
      for (const bucket of bucketByEnv) {
        const params = {
          Bucket: bucket,
          Key: key,
          Body: body,
          ACL: 'public-read',
          ContentType: `${type}; charset=utf-8`,
          ContentEncoding: encoding,
          CacheControl: this.options.cacheControl
        } satisfies PutObjectCommandInput
        currentBucket = params.Bucket
        await s3.send(new PutObjectCommand(params))
        this.logger.info(`Uploaded ${styles.filepath(filepath)} to ${styles.URL(currentBucket)}`)
      }
    } catch (err) {
      const error = new ToolKitError(`Upload of ${filepath} to ${currentBucket} failed`)
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
  }

  async run({ cwd, command }: TaskRunContext): Promise<void> {
    // Wrap extensions in braces if there are multiple
    const extensions = this.options.extensions.includes(',')
      ? `{${this.options.extensions}}`
      : this.options.extensions
    const globFile = `**/*${extensions}`
    const resolvedDirectory = path.resolve(cwd, this.options.directory)
    const files = await glob(globFile, { cwd: resolvedDirectory, nodir: true })

    if (files.length === 0) {
      throw new ToolKitError(`no files found at the provided directory: ${resolvedDirectory}`)
    }

    const accessKeyId = process.env[this.options.accessKeyIdEnvVar]
    const secretAccessKey = process.env[this.options.secretAccessKeyEnvVar]

    if (!accessKeyId || !secretAccessKey) {
      const missingVars = [
        !accessKeyId ? this.options.accessKeyIdEnvVar : false,
        !secretAccessKey ? this.options.secretAccessKeyEnvVar : false
      ]

      const error = new ToolKitError(
        `environment variable${missingVars.length > 1 ? 's' : ''} ${missingVars.join(' and ')} not set`
      )
      error.details = `if your AWS credentials are stored in different environment variables, set the ${styles.code(
        'accessKeyIdEnvVar'
      )} and ${styles.code('secretAccessKeyEnvVar')} options for this task.`
      throw error
    }

    const s3 = new S3Client({
      region: this.options.region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })
    const isReviewApp = process.env.NODE_ENV === 'branch' || command === 'deploy:review'

    await Promise.all(files.map((file) => this.uploadFile(file, s3, isReviewApp)))
  }
}

const getFileType = (filename: string) => {
  // We need to know the original file type so ignore any compression
  const originalFile = filename.replace(/\.(br|gz)$/, '')
  const ext = path.extname(originalFile)

  return mime.getType(ext)
}

const getFileEncoding = (filename: string) => {
  const ext = path.extname(filename)

  switch (ext) {
    case '.gz':
      return 'gzip'
    case '.br':
      return 'br'
  }
}
