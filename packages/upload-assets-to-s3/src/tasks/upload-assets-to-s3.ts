import { Task } from '@dotcom-tool-kit/task'
import * as fs from 'fs'
import aws from 'aws-sdk'
import path from 'path'
import mime from 'mime'
import { glob } from 'glob'

export type UploadAssetsToS3Options = {
  accessKeyId: string
  secretAccessKey: string
  directory: string
  bucketByEnv: {
    [key: string]: string[] | string
  }
  destination: string
  extensions: string
  cacheControl: string
}

export default class UploadAssetsToS3 extends Task<UploadAssetsToS3Options> {
  static description = ''

  static defaultOptions: UploadAssetsToS3Options = {
    accessKeyId: process.env.aws_access_hashed_assets || '',
    secretAccessKey: process.env.aws_secret_hashed_assets || '',
    directory: 'public',
    bucketByEnv: {
      review: 'ft-next-hashed-assets-reivew',
      prod: ['ft-next-hashed-assets-prod', 'ft-next-hashed-assets-prod-us']
    },
    destination: 'hashed-assets/page-kit',
    extensions: 'js,css,map,gz,br,png,jpg,jpeg,gif,webp,svg,ico,json',
    cacheControl: 'public, max-age=31536000, stale-while-revalidate=60, stale-if-error=3600'
  }

  async run(): Promise<void> {
    await uploadAssetsToS3(this.options)
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

const uploadFile = async (file: string, options: UploadAssetsToS3Options, s3: aws.S3) => {
  const basename = file.split('/').splice(1).join('/') // remove first directory only
  const type = getFileType(basename)
  const encoding = getFileEncoding(basename)
  const key = path.posix.join(options.destination, basename)

  const params = {
    Bucket: '',
    Key: key,
    Body: fs.createReadStream(file),
    ACL: 'public-read',
    ContentType: `${type}; charset=utf-8`,
    ContentEncoding: encoding,
    CacheControl: options.cacheControl
  }

  const { review, prod } = options.bucketByEnv
  const bucketByEnv = process.env.NODE_ENV === 'branch' ? review : prod

  try {
    if (typeof bucketByEnv === 'string') {
      params.Bucket = bucketByEnv
      const data = await s3.upload(params).promise()
      console.log(`Uploaded ${basename} to ${data.Location}`)
    } else {
      for (const bucket of bucketByEnv) {
        params.Bucket = bucket
        const data = await s3.upload(params).promise()
        console.log(`Uploaded ${basename} to ${data.Location}`)
      }
    }
  } catch (error) {
    console.error(`Upload of ${basename} to ${params.Bucket} failed`)
    throw error
  }
}

async function uploadAssetsToS3(options: UploadAssetsToS3Options) {
  // Wrap extensions in braces if there are multiple
  const extensions = options.extensions.includes(',') ? `{${options.extensions}}` : options.extensions
  const globFile = `${options.directory}/**/*${extensions}`
  const files = glob.sync(globFile)

  const s3 = new aws.S3({
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey
  })

  return Promise.all(files.map((file) => uploadFile(file, options, s3)))
}
