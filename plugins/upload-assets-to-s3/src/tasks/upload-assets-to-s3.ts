import { Task } from '@dotcom-tool-kit/types'
import * as fs from 'fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import path from 'path'
import mime from 'mime'
import { glob } from 'glob'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import {
  UploadAssetsToS3Options,
  UploadAssetsToS3Schema
} from '@dotcom-tool-kit/schemas/lib/plugins/upload-assets-to-s3'

export default class UploadAssetsToS3 extends Task<typeof UploadAssetsToS3Schema> {
  static description = ''

  async run(): Promise<void> {
    await this.uploadAssetsToS3(this.options)
  }
  async uploadFile(file: string, options: UploadAssetsToS3Options, s3: S3Client): Promise<void> {
    const type = getFileType(file)
    const encoding = getFileEncoding(file)
    const filepath = path.join(options.directory, file)
    const body = fs.createReadStream(filepath)
    const key = path.posix.join(options.destination, file)

    const bucketByEnv = process.env.NODE_ENV === 'branch' ? options.reviewBucket : options.prodBucket
    let currentBucket = ''

    try {
      if (typeof bucketByEnv === 'string') {
        const params = {
          Bucket: bucketByEnv,
          Key: key,
          Body: body,
          ACL: 'public-read',
          ContentType: `${type}; charset=utf-8`,
          ContentEncoding: encoding,
          CacheControl: options.cacheControl
        }
        currentBucket = params.Bucket
        await s3.send(new PutObjectCommand(params))
        this.logger.info(`Uploaded ${styles.filepath(filepath)} to ${styles.URL(currentBucket)}`)
      } else {
        for (const bucket of bucketByEnv) {
          const params = {
            Bucket: bucket,
            Key: key,
            Body: body,
            ACL: 'public-read',
            ContentType: `${type}; charset=utf-8`,
            ContentEncoding: encoding,
            CacheControl: options.cacheControl
          }
          currentBucket = params.Bucket
          await s3.send(new PutObjectCommand(params))
          this.logger.info(`Uploaded ${styles.filepath(filepath)} to ${styles.URL(currentBucket)}`)
        }
      }
    } catch (err) {
      const error = new ToolKitError(`Upload of ${filepath} to ${currentBucket} failed`)
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
  }

  async uploadAssetsToS3(options: UploadAssetsToS3Options): Promise<void> {
    // Wrap extensions in braces if there are multiple
    const extensions = options.extensions.includes(',') ? `{${options.extensions}}` : options.extensions
    const globFile = `**/*${extensions}`
    const files = glob.sync(globFile, { cwd: options.directory, nodir: true })

    if (files.length === 0) {
      throw new ToolKitError(`no files found at the provided directory: ${options.directory}`)
    }

    // HACK:20231006:IM Doppler doesn't support secrets with lowercase
    // characters so let's check if the provided AWS environment variable name
    // is available in all caps as will be the case when running our migration
    // script.
    const checkUppercaseName = (envName: string): string | undefined => {
      return process.env[envName] ?? process.env[envName.toUpperCase()]
    }
    const s3 = new S3Client({
      region: options.region,
      // will fallback to default value for accessKeyId if neither
      // accessKeyIdEnvVar nor accessKeyId have been provided as options
      credentials: {
        accessKeyId:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          checkUppercaseName(options.accessKeyIdEnvVar ?? options.accessKeyId)!,
        secretAccessKey:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          checkUppercaseName(options.secretAccessKeyEnvVar ?? options.secretAccessKey)!
      }
    })

    await Promise.all(files.map((file) => this.uploadFile(file, options, s3)))
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
