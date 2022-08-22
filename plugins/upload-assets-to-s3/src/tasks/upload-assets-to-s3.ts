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
    accessKeyId: process.env.aws_access_hashed_assets || '',
    secretAccessKey: process.env.aws_secret_hashed_assets || '',
    directory: 'public',
    reviewBucket: ['ft-next-hashed-assets-preview'],
    prodBucket: ['ft-next-hashed-assets-prod', 'ft-next-hashed-assets-prod-us'],
    destination: 'hashed-assets/page-kit',
    extensions: 'js,css,map,gz,br,png,jpg,jpeg,gif,webp,svg,ico,json',
    cacheControl: 'public, max-age=31536000, stale-while-revalidate=60, stale-if-error=3600'
  }

  async run(): Promise<void> {
    await this.uploadAssetsToS3(this.options)
  }
  async uploadFile(file: string, options: UploadAssetsToS3Options, s3: aws.S3): Promise<void> {
    const basename = file.split('/').splice(1).join('/') // remove first directory only
    const type = getFileType(basename)
    const encoding = getFileEncoding(basename)
    const key = options.destination

    const bucketByEnv = process.env.NODE_ENV === 'branch' ? options.reviewBucket : options.prodBucket
    let currentBucket = ''

    try {
      if (typeof bucketByEnv === 'string') {
        const params = {
          Bucket: bucketByEnv,
          Key: key,
          Body: fs.createReadStream(file),
          ACL: 'public-read',
          ContentType: `${type}; charset=utf-8`,
          ContentEncoding: encoding,
          CacheControl: options.cacheControl
        }
        currentBucket = params.Bucket
        const data = await s3.upload(params).promise()
        this.logger.info(`Uploaded ${styles.filepath(basename)} to ${styles.URL(data.Location)}`)
      } else {
        for (const bucket of bucketByEnv) {
          const params = {
            Bucket: bucket,
            Key: key,
            Body: fs.createReadStream(file),
            ACL: 'public-read',
            ContentType: `${type}; charset=utf-8`,
            ContentEncoding: encoding,
            CacheControl: options.cacheControl
          }
          currentBucket = params.Bucket
          const data = await s3.upload(params).promise()
          this.logger.info(`Uploaded ${styles.filepath(basename)} to ${styles.URL(data.Location)}`)
        }
      }
    } catch (err) {
      const error = new ToolKitError(`Upload of ${basename} to ${currentBucket} failed`)
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
  }

  async uploadAssetsToS3(options: UploadAssetsToS3Options): Promise<void> {
    // Wrap extensions in braces if there are multiple
    const extensions = options.extensions.includes(',') ? `{${options.extensions}}` : options.extensions
    const globFile = `${options.directory}/**/*${extensions}`
    const files = glob.sync(globFile)

    const s3 = new aws.S3({
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey
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
