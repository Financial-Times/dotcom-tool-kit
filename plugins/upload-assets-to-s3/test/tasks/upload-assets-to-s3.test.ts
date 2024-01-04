import { describe, it, expect, beforeEach } from '@jest/globals'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { UploadAssetsToS3Options } from '@dotcom-tool-kit/schemas/lib/plugins/upload-assets-to-s3'
import * as path from 'path'
import winston, { Logger } from 'winston'
import UploadAssetsToS3 from '../../src/tasks/upload-assets-to-s3'
jest.mock('@aws-sdk/client-s3')

const mockedS3Client = jest.mocked(S3Client, true)
const mockedPutObjectCommand = jest.mocked(PutObjectCommand, true)
const logger = (winston as unknown) as Logger

const testDirectory = path.join(__dirname, '../files')

const defaults: UploadAssetsToS3Options = {
  accessKeyId: 'aws_access_hashed_assets',
  secretAccessKey: 'aws_secret_hashed_assets',
  directory: 'public',
  reviewBucket: ['ft-next-hashed-assets-preview'],
  prodBucket: ['ft-next-hashed-assets-prod'],
  region: 'eu-west-1',
  destination: 'hashed-assets/page-kit',
  extensions: 'js,css,map,gz,br,png,jpg,jpeg,gif,webp,svg,ico,json',
  cacheControl: 'public, max-age=31536000, stale-while-revalidate=60, stale-if-error=3600'
}

describe('upload-assets-to-s3', () => {
  beforeEach(() => {
    mockedS3Client.prototype.send.mockReturnValue({
      promise: jest.fn().mockResolvedValue('mock upload complete')
    } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
  })

  it('should upload all globbed files for review', async () => {
    const task = new UploadAssetsToS3(logger, 'UploadAssestToS3', {
      ...defaults,
      directory: testDirectory
    })
    process.env.NODE_ENV = 'branch'

    await task.run()

    const s3 = mockedS3Client.mock.instances[0]
    expect(s3.send).toHaveBeenCalledTimes(4)
  })

  it('should upload all globbed files for prod', async () => {
    const task = new UploadAssetsToS3(logger, 'UploadAssestToS3', {
      ...defaults,
      directory: testDirectory
    })
    process.env.NODE_ENV = 'production'

    await task.run()

    const s3 = mockedS3Client.mock.instances[0]
    expect(s3.send).toHaveBeenCalledTimes(4)
  })

  it('should strip base path from S3 key', async () => {
    const task = new UploadAssetsToS3(logger, 'UploadAssestToS3', {
      ...defaults,
      extensions: 'gz',
      directory: testDirectory,
      destination: 'testdir'
    })
    process.env.NODE_ENV = 'production'

    await task.run()
    const s3 = jest.mocked(mockedS3Client.mock.instances[0])
    expect(s3.send).toHaveBeenCalledTimes(1)
    expect(mockedPutObjectCommand.mock.calls[0][0]).toHaveProperty('Key', 'testdir/nested/test.js.gz')
  })

  it('should use correct Content-Encoding for compressed files', async () => {
    const task = new UploadAssetsToS3(logger, 'UploadAssestToS3', {
      ...defaults,
      extensions: 'gz',
      directory: testDirectory
    })
    process.env.NODE_ENV = 'production'

    await task.run()

    const s3 = mockedS3Client.mock.instances[0]
    expect(s3.send).toHaveBeenCalledTimes(1)
    expect(mockedPutObjectCommand.mock.calls[0][0]).toHaveProperty('ContentEncoding', 'gzip')
  })

  it('should print an error when AWS fails', async () => {
    const mockError = 'mock 404'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(mockedS3Client.prototype.send as any).mockRejectedValue(new Error(mockError))

    const task = new UploadAssetsToS3(logger, 'UploadAssestToS3', {
      ...defaults,
      directory: testDirectory
    })

    await expect(task.run()).rejects.toThrow('ft-next-hashed-assets-prod failed')
  })

  // HACK:20231006:IM make sure hack to support Doppler migration works
  it('should fallback to uppercase environment variable', async () => {
    const task = new UploadAssetsToS3(logger, 'UploadAssestToS3', {
      ...defaults,
      directory: testDirectory
    })
    // must use delete to ensure an environment variable is undefined, setting
    // 'undefined' will just stringify the word
    delete process.env.aws_access_hashed_assets
    process.env.AWS_ACCESS_HASHED_ASSETS = '1234'

    await task.run()

    expect(mockedS3Client).toHaveBeenCalledWith(
      expect.objectContaining({ credentials: expect.objectContaining({ accessKeyId: '1234' }) })
    )
  })
})
