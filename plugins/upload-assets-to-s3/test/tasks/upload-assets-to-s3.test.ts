import { describe, it, expect, beforeEach } from '@jest/globals'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import * as path from 'path'
import winston, { Logger } from 'winston'
import type * as z from 'zod'
import UploadAssetsToS3, { type UploadAssetsToS3Schema } from '../../src/tasks/upload-assets-to-s3'
jest.mock('@aws-sdk/client-s3')

const mockedS3Client = jest.mocked(S3Client, true)
const mockedPutObjectCommand = jest.mocked(PutObjectCommand, true)
const logger = winston as unknown as Logger

const testDirectory = path.join(__dirname, '../files')

const defaults: z.infer<typeof UploadAssetsToS3Schema> = {
  accessKeyIdEnvVar: 'AWS_ACCESS_HASHED_ASSETS',
  secretAccessKeyEnvVar: 'AWS_SECRET_HASHED_ASSETS',
  directory: 'public',
  reviewBucket: ['ft-next-hashed-assets-preview'],
  prodBucket: ['ft-next-hashed-assets-prod'],
  region: 'eu-west-1',
  destination: 'hashed-assets/page-kit',
  extensions: 'js,css,map,gz,br,png,jpg,jpeg,gif,webp,svg,ico,json',
  cacheControl: 'public, max-age=31536000, stale-while-revalidate=60, stale-if-error=3600'
}

describe('upload-assets-to-s3', () => {
  let oldEnv: Record<string, string | undefined>

  beforeEach(() => {
    oldEnv = { ...process.env }

    mockedS3Client.prototype.send.mockReturnValue({
      promise: jest.fn().mockResolvedValue('mock upload complete')
    } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
  })

  afterEach(() => {
    process.env = oldEnv
  })

  it('should throw an error if env vars are not set', async () => {
    const task = new UploadAssetsToS3(
      logger,
      'UploadAssetsToS3',
      {},
      {
        ...defaults,
        directory: testDirectory
      }
    )
    process.env.NODE_ENV = 'branch'
    process.env.AWS_ACCESS_HASHED_ASSETS = ''
    process.env.AWS_SECRET_HASHED_ASSETS = ''

    await expect(task.run({ command: 'release:remote', cwd: '' })).rejects.toThrowErrorMatchingInlineSnapshot(
      `"environment variables AWS_ACCESS_HASHED_ASSETS and AWS_SECRET_HASHED_ASSETS not set"`
    )
  })

  it('should upload all globbed files for review', async () => {
    const task = new UploadAssetsToS3(
      logger,
      'UploadAssetsToS3',
      {},
      {
        ...defaults,
        directory: testDirectory
      }
    )
    process.env.NODE_ENV = 'branch'
    process.env.AWS_ACCESS_HASHED_ASSETS = 'access'
    process.env.AWS_SECRET_HASHED_ASSETS = 'secret'

    await task.run({ command: 'release:remote', cwd: '' })

    const s3 = mockedS3Client.mock.instances[0]
    expect(s3.send).toHaveBeenCalledTimes(4)
  })

  it('should upload all globbed files for prod', async () => {
    const task = new UploadAssetsToS3(
      logger,
      'UploadAssetsToS3',
      {},
      {
        ...defaults,
        directory: testDirectory
      }
    )
    process.env.NODE_ENV = 'production'
    process.env.AWS_ACCESS_HASHED_ASSETS = 'access'
    process.env.AWS_SECRET_HASHED_ASSETS = 'secret'

    await task.run({ command: 'release:remote', cwd: '' })

    const s3 = mockedS3Client.mock.instances[0]
    expect(s3.send).toHaveBeenCalledTimes(4)
  })

  it('should strip base path from S3 key', async () => {
    const task = new UploadAssetsToS3(
      logger,
      'UploadAssetsToS3',
      {},
      {
        ...defaults,
        extensions: 'gz',
        directory: testDirectory,
        destination: 'testdir'
      }
    )
    process.env.NODE_ENV = 'production'
    process.env.AWS_ACCESS_HASHED_ASSETS = 'access'
    process.env.AWS_SECRET_HASHED_ASSETS = 'secret'

    await task.run({ command: 'release:remote', cwd: '' })
    const s3 = jest.mocked(mockedS3Client.mock.instances[0])
    expect(s3.send).toHaveBeenCalledTimes(1)
    expect(mockedPutObjectCommand.mock.calls[0][0]).toHaveProperty('Key', 'testdir/nested/test.js.gz')
  })

  it('should use correct Content-Encoding for compressed files', async () => {
    const task = new UploadAssetsToS3(
      logger,
      'UploadAssetsToS3',
      {},
      {
        ...defaults,
        extensions: 'gz',
        directory: testDirectory
      }
    )
    process.env.NODE_ENV = 'production'
    process.env.AWS_ACCESS_HASHED_ASSETS = 'access'
    process.env.AWS_SECRET_HASHED_ASSETS = 'secret'

    await task.run({ command: 'release:remote', cwd: '' })

    const s3 = mockedS3Client.mock.instances[0]
    expect(s3.send).toHaveBeenCalledTimes(1)
    expect(mockedPutObjectCommand.mock.calls[0][0]).toHaveProperty('ContentEncoding', 'gzip')
  })

  it('should print an error when AWS fails', async () => {
    const mockError = 'mock 404'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(mockedS3Client.prototype.send as any).mockRejectedValue(new Error(mockError))

    const task = new UploadAssetsToS3(
      logger,
      'UploadAssetsToS3',
      {},
      {
        ...defaults,
        directory: testDirectory
      }
    )

    process.env.AWS_ACCESS_HASHED_ASSETS = 'access'
    process.env.AWS_SECRET_HASHED_ASSETS = 'secret'

    await expect(task.run({ command: 'release:remote', cwd: '' })).rejects.toThrow(
      'ft-next-hashed-assets-prod failed'
    )
  })
})
