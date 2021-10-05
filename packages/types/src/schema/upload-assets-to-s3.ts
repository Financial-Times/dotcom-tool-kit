import { SchemaOutput } from '../schema'

export const UploadAssetsToS3Schema = {
  accessKeyId: 'string',
  secretAccessKey: 'string',
  directory: 'string',
  reviewBucket: 'array.string',
  prodBucket: 'array.string',
  destination: 'string',
  extensions: 'string',
  cacheControl: 'string'
} as const
export type UploadAssetsToS3Options = SchemaOutput<typeof UploadAssetsToS3Schema>

export const Schema = UploadAssetsToS3Schema
