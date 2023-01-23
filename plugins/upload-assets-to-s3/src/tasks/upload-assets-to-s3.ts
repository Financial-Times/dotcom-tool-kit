import { Task } from '@dotcom-tool-kit/types'
import * as fs from 'fs'
import aws from 'aws-sdk'
import path from 'path'
import mime from 'mime'
import { glob } from 'glob'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import {
  UploadAssetsToS3Options,
  UploadAssetsToS3Schema
} from '@dotcom-tool-kit/types/lib/schema/upload-assets-to-s3'

export default class UploadAssetsToS3 extends Task<typeof UploadAssetsToS3Schema> {
  static description = ''

  static defaultOptions: UploadAssetsToS3Options = {
    accessKeyId: 'aws_access_hashed_assets',
    secretAccessKey: 'aws_secret_hashed_assets',
    directory: 'public',
    reviewBucket: ['ft-next-hashed-assets-preview'],
    prodBucket: ['ft-next-hashed-assets-prod'],
    destination: 'hashed-assets/page-kit',
    extensions: 'js,css,map,gz,br,png,jpg,jpeg,gif,webp,svg,ico,json',
    cacheControl: 'public, max-age=31536000, stale-while-revalidate=60, stale-if-error=3600'
  }

  async run(): Promise<void> {
    await this.uploadAssetsToS3(this.options)
  }
  async uploadFile(file: string, options: UploadAssetsToS3Options, s3: aws.S3): Promise<void> {
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
        const data = await s3.upload(params).promise()
        this.logger.info(`Uploaded ${styles.filepath(filepath)} to ${styles.URL(data.Location)}`)
      } else {
        const uploadPromises = bucketByEnv.map((bucket) => {
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
          return s3.upload(params).promise()
        })
        await Promise.all(uploadPromises).then((resolvedUploadPromises) => {
          for (const uploadResponse of resolvedUploadPromises) {
            this.logger.info(
              `Uploaded ${styles.filepath(filepath)} to ${styles.URL(uploadResponse.Location)}`
            )
          }
        })
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

    const s3 = new aws.S3({
      // fallback to default value for accessKeyId if neither accessKeyIdEnvVar or accessKeyId have been provided as options
      accessKeyId:
        /* eslint-disable-next-line */
        process.env[options.accessKeyIdEnvVar ?? options.accessKeyId!],
      secretAccessKey:
        /* eslint-disable-next-line */
        process.env[options.secretAccessKeyEnvVar ?? options.secretAccessKey!]
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
