import { schema } from '../../src/tasks/upload-assets-to-s3'

describe('upload assets to s3 schema', () => {
  it('should apply defaults', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {
          "accessKeyIdEnvVar": "AWS_ACCESS_HASHED_ASSETS",
          "cacheControl": "public, max-age=31536000, stale-while-revalidate=60, stale-if-error=3600",
          "destination": "hashed-assets/page-kit",
          "directory": "public",
          "extensions": "js,css,map,gz,br,png,jpg,jpeg,gif,webp,svg,ico,json",
          "prodBucket": [
            "ft-next-hashed-assets-prod",
          ],
          "region": "eu-west-1",
          "reviewBucket": [
            "ft-next-hashed-assets-preview",
          ],
          "secretAccessKeyEnvVar": "AWS_SECRET_HASHED_ASSETS",
        },
        "success": true,
      }
    `)
  })

  it('should allow through only expected keys', () => {
    expect(
      schema.safeParse({
        accessKeyIdEnvVar: 'AWS_ACCESS_KEY',
        secretAccessKeyEnvVar: 'AWS_SECRET_KEY',
        directory: 'dist',
        reviewBucket: ['assets-preview'],
        prodBucket: ['assets-prod'],
        region: 'us-east-1',
        destination: 'path/to/assets',
        extensions: 'avif',
        cacheControl: 'private, no-store'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "accessKeyIdEnvVar": "AWS_ACCESS_KEY",
          "cacheControl": "private, no-store",
          "destination": "path/to/assets",
          "directory": "dist",
          "extensions": "avif",
          "prodBucket": [
            "assets-prod",
          ],
          "region": "us-east-1",
          "reviewBucket": [
            "assets-preview",
          ],
          "secretAccessKeyEnvVar": "AWS_SECRET_KEY",
        },
        "success": true,
      }
    `)
  })
})
