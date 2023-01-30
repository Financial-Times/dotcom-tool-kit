# @dotcom-tool-kit/upload-assets-to-s3

Upload files to a configured AWS S3 bucket.

## Installation

Install `@dotcom-tool-kit/upload-assets-to-s3` as a `devDependency` in your app:

```sh
npm install --save-dev @dotcom-tool-kit/upload-assets-to-s3
```

Add the plugin to your [Tool Kit configuration](https://github.com/financial-times/dotcom-tool-kit/blob/main/readme.md#configuration):

```yaml
plugins:
	- '@dotcom-tool-kit/upload-assets-to-s3'
```


## Options
| Key | Description | Default value |
|-|-|-|
| `accessKeyIdEnvVar` | variable name of the project's aws access key id. If uploading to multiple buckets the same credentials will need to work for all. | no default value - for backwards compatability the plugin falls back to the default value for `accessKeyId` |
| `secretAccessKeyEnvVar` | variable name of the project's aws secret access key | no default value - for backwards compatability the plugin falls back to the default value for `secretAccessKey` |
| `accessKeyId` | **DEPRECATED** variable name of the project's aws access key id | 'aws_access_hashed_assets' |
| `secretAccessKey` | **DEPRECATED** variable name of the project's aws secret access key | 'aws_secret_hashed_assets' |
| `directory` | the folder in the project whose contents will be uploaded to S3 | 'public' |
| `reviewBucket` | the development or test S3 bucket | `['ft-next-hashed-assets-preview']` |
| `prodBucket` | production S3 bucket/s; an array of strings. The same files will be uploaded to each. _Note: most Customer Products buckets that have a `prod` and `prod-us` version are already configured in AWS to replicate file changes from one to the other so you don't need to specify both here. Also, if multiple buckets are specified the same credentials will need to be valid for both for the upload to be successful_ | `['ft-next-hashed-assets-prod']` |
| `region` | the AWS region your buckets are stored in (let the Platforms team know if you need to upload to multiple buckets in multiple regions) | eu-west-1 |
| `destination` | the destination folder for uploaded assets. Set to `''` to upload assets to the top level of the bucket | 'hashed-assets/page-kit' |
| `extensions` | file extensions to be uploaded to S3 | 'js,css,map,gz,br,png,jpg,jpeg,gif,webp,svg,ico,json' |
| `cacheControl` | header that controls how long your files stay in a CloudFront cache before CloudFront forwards another request to your origin | 'public, max-age=31536000, stale-while-revalidate=60, stale-if-error=3600' |

Example:
```yml
'@dotcom-tool-kit/upload-assets-to-s3':
  '@dotcom-tool-kit/upload-assets-to-s3':
    accessKeyId: AWS_ACCESS
    secretAccessKey: AWS_KEY
    prodBucket: ['ft-next-service-registry-prod']
    reviewBucket: ['ft-next-service-registry-dev']
    destination: ''
```

## Testing uploads using the review bucket

You can test uploads to S3 locally on your review bucket to check that you are happy with the configuration. To do this set your `NODE_ENV` to `branch`:

```bash
$ export NODE_ENV=branch
```

If the AWS key names for accessing the review bucket are different to the prod bucket then update those in the `.toolkitrc.yml`.

The `UploadAssetsToS3` task can run on any hook so you can configure it to run on a local hook to test deployment from the command line. For example, it could be added to your `build:local` hook as follows:

```yml
plugins:
  - '@dotcom-tool-kit/webpack'
  - '@dotcom-tool-kit/upload-assets-to-s3'
hooks:
  'build:local':
    - WebpackDevelopment
    - UploadAssetsToS3
```

Then running `npm run build` will run the `UploadAssetsToS3` task on your review bucket.

## Tasks

| Name | Description | Preconfigured Hook|
|-|-|-|
| `UploadAssetsTos3` | Uploads provided files to a given S3 bucket | `release:remote` |
