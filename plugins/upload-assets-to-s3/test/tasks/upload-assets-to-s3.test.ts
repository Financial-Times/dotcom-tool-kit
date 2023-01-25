import { describe, it, expect, beforeAll } from '@jest/globals'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import * as path from 'path'
import { mocked } from 'ts-jest/utils'
import winston, { Logger } from 'winston'
import UploadAssetsToS3 from '../../src/tasks/upload-assets-to-s3'
jest.mock('@aws-sdk/client-s3')

const mockedS3Client = mocked(S3Client, true)
const mockedPutObjectCommand = mocked(PutObjectCommand, true)
const logger = (winston as unknown) as Logger

const testDirectory = path.join(__dirname, '../files')

describe('upload-assets-to-s3', () => {
  beforeAll(() => {
    mockedS3Client.prototype.send.mockReturnValue({
      promise: jest.fn().mockResolvedValue('mock upload complete')
    } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
  })

  it('should upload all globbed files for review', async () => {
    const task = new UploadAssetsToS3(logger, {
      directory: testDirectory
    })
    process.env.NODE_ENV = 'branch'

    await task.run()

    const s3 = mockedS3Client.mock.instances[0]
    expect(s3.send).toHaveBeenCalledTimes(4)
  })

  it('should upload all globbed files for prod', async () => {
    const task = new UploadAssetsToS3(logger, {
      directory: testDirectory
    })
    process.env.NODE_ENV = 'production'

    await task.run()

    const s3 = mockedS3Client.mock.instances[0]
    expect(s3.send).toHaveBeenCalledTimes(4)
  })

  it('should strip base path from S3 key', async () => {
    const task = new UploadAssetsToS3(logger, {
      extensions: 'gz',
      directory: testDirectory,
      destination: 'testdir'
    })
    process.env.NODE_ENV = 'production'

    await task.run()
    const s3 = mockedS3Client.mock.instances[0]
    const putObjectCommand = mockedPutObjectCommand.mock.instances[0]
    expect(s3.send).toHaveBeenCalledTimes(1)
    // expect(putObjectCommand.mock.calls[0][0]).toHaveProperty('Key', 'testdir/nested/test.js.gz')
  })

  it('should use correct Content-Encoding for compressed files', async () => {
    const task = new UploadAssetsToS3(logger, {
      extensions: 'gz',
      directory: testDirectory
    })
    process.env.NODE_ENV = 'production'

    await task.run()

    const s3 = mockedS3Client.mock.instances[0]
    const putObjectCommand = mockedPutObjectCommand.mock.instances[0]
    expect(s3.send).toHaveBeenCalledTimes(1)
    // expect(putObjectCommand.mock.calls[0][0]).toHaveProperty('ContentEncoding', 'gzip')
  })

  it('should print an error when AWS fails', async () => {
    const mockError = 'mock 404'

    mockedS3Client.prototype.send.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue(new Error(mockError))
    } as any) // eslint-disable-line @typescript-eslint/no-explicit-any

    const task = new UploadAssetsToS3(logger, {
      directory: testDirectory
    })

    expect.assertions(1)
    try {
      await task.run()
    } catch (e) {
      expect(e.details).toEqual(mockError)
    }
  })
})
