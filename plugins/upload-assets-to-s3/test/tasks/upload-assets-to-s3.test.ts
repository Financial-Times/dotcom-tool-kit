import { describe, it, expect, beforeAll } from '@jest/globals'
import aws from 'aws-sdk'
import * as path from 'path'
import { mocked } from 'ts-jest/utils'
import winston, { Logger } from 'winston'
import UploadAssetsToS3 from '../../src/tasks/upload-assets-to-s3'
jest.mock('aws-sdk')

const mockedAWS = mocked(aws, true)
const logger = (winston as unknown) as Logger

const testDirectory = path.join(__dirname, '../files')

describe('upload-assets-to-s3', () => {
  beforeAll(() => {
    mockedAWS.S3.prototype.upload.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Location: 'mock location' })
    } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
  })

  it('should upload all globbed files for review', async () => {
    const task = new UploadAssetsToS3(logger, {
      directory: testDirectory
    })
    process.env.NODE_ENV = 'branch'

    await task.run()

    const s3 = mockedAWS.S3.mock.instances[0]
    expect(s3.upload).toHaveBeenCalledTimes(4)
  })

  it('should upload all globbed files for prod', async () => {
    const task = new UploadAssetsToS3(logger, {
      directory: testDirectory
    })
    process.env.NODE_ENV = 'production'

    await task.run()

    const s3 = mockedAWS.S3.mock.instances[0]
    expect(s3.upload).toHaveBeenCalledTimes(8)
  })

  it('should use correct Content-Encoding for compressed files', async () => {
    const task = new UploadAssetsToS3(logger, {
      extensions: 'gz',
      directory: testDirectory
    })
    process.env.NODE_ENV = 'production'

    await task.run()

    const s3 = mocked(mockedAWS.S3.mock.instances[0])
    expect(s3.upload).toHaveBeenCalledTimes(2)
    expect(s3.upload.mock.calls[0][0]).toHaveProperty('ContentEncoding', 'gzip')
  })

  it('should print an error when AWS fails', async () => {
    const mockError = 'mock 404'

    mockedAWS.S3.prototype.upload.mockReturnValueOnce({
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
