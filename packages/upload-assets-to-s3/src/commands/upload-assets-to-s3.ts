import { Command } from '@oclif/command'
import * as fs from 'fs'
import aws from 'aws-sdk'
import path from 'path'
import mime from 'mime'
import { glob } from 'glob'

export interface UploadAssetsToS3Options {
  accessKeyId: string
  secretAccessKey: string
  directory: string
  bucket: string
  destination: string
  extensions: string
  cacheControl: string
}

export default class UploadAssetsToS3 extends Command {
  static description = ''

  options: UploadAssetsToS3Options = {
    accessKeyId: process.env.AWS_ACCESS || '',
    secretAccessKey: process.env.AWS_SECRET || '',
    directory: 'public',
    bucket: 'ft-next-hashed-assets-prod',
    destination: 'hashed-assets/uploaded',
    extensions: 'js,css,map,gz,br,png,jpg,jpeg,gif,webp,svg,ico,json',
    cacheControl: 'public, max-age=31536000, stale-while-revalidate=60, stale-if-error=3600'
  }

  async run(): Promise<void[]> {
    return uploadAssetsToS3(this.options)
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
    Bucket: options.bucket,
    Key: key,
    Body: fs.createReadStream(file),
    ACL: 'public-read',
    ContentType: `${type}; charset=utf-8`,
    ContentEncoding: encoding,
    CacheControl: options.cacheControl
  }

  return new Promise<void>((resolve, reject) => {
    return s3.upload(params, (error: Error, data: { Location: string }) => {
      if (error) {
        console.error(`Upload of ${basename} to ${options.bucket} failed`) // eslint-disable-line no-console
        reject(error)
      } else {
        console.log(`Uploaded ${basename} to ${data.Location}`) // eslint-disable-line no-console
        resolve()
      }
    })
  })
}

async function uploadAssetsToS3(options: UploadAssetsToS3Options) {
  const files = glob.sync(`${options.directory}/**/*{${options.extensions}}`)

  const s3 = new aws.S3({
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey
  })

  return Promise.all(files.map((file) => uploadFile(file, options, s3)))
}
