import aws from 'aws-sdk'
import UploadAssetsToS3 from '../../src/commands/upload-assets-to-s3'
import { mocked } from 'ts-jest/utils'
jest.mock('aws-sdk')

const mockedAWS = mocked(aws, true)

const testDirectory = 'test/files'

describe('upload-assets-to-s3', () => {
  beforeAll(() => {
    mockedAWS.S3.prototype.upload.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Location: 'mock location' })
    } as any)
  })

  it('should upload all globbed files', async () => {
    const command = new UploadAssetsToS3([], {} as any)
    command.options.directory = testDirectory
    await command.run()

    const s3 = mockedAWS.S3.mock.instances[0]
    expect(s3.upload).toHaveBeenCalledTimes(4)
  })

  it('should use correct Content-Encoding for compressed files', async () => {
    const command = new UploadAssetsToS3([], {} as any)
    command.options.extensions = 'gz'
    command.options.directory = testDirectory
    await command.run()

    const s3 = mocked(mockedAWS.S3.mock.instances[0])
    expect(s3.upload).toHaveBeenCalledTimes(1)
    expect(s3.upload.mock.calls[0][0]).toHaveProperty('ContentEncoding', 'gzip')
  })

  it('should print an error when AWS fails', async () => {
    mockedAWS.S3.prototype.upload.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('mock 404'))
    } as any)
    const logSpy = jest.spyOn(console, 'error')

    const command = new UploadAssetsToS3([], {} as any)
    command.options.directory = testDirectory

    await command.run()

    expect(logSpy).toHaveBeenCalledTimes(4)
  })
})
