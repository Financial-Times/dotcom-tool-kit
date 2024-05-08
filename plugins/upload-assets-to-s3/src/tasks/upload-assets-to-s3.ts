import { Task } from '@dotcom-tool-kit/base'
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
} from '@dotcom-tool-kit/schemas/tasks/upload-assets-to-s3.js'

export default class UploadAssetsToS3 extends Task<{ task: typeof UploadAssetsToS3Schema }> {
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

    const accessKeyId = process.env[options.accessKeyIdEnvVar]
    const secretAccessKey = process.env[options.secretAccessKeyEnvVar]

    if (!accessKeyId || !secretAccessKey) {
      const missingVars = [
        !accessKeyId ? options.accessKeyIdEnvVar : false,
        !secretAccessKey ? options.secretAccessKeyEnvVar : false
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
      region: options.region,
      credentials: {
        accessKeyId,
        secretAccessKey
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
