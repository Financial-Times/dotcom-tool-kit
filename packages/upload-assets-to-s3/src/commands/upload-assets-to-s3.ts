import { Command, flags } from '@oclif/command'
import * as fs from 'fs';
import aws from 'aws-sdk';
import path from 'path';
import mime from 'mime';
import { glob } from 'glob';

const defaultDirectory = 'public';
const defaultBucket = 'ft-next-hashed-assets-prod';
const defaultDestination = 'hashed-assets/uploaded';
const defaultFileExtensions = ['js', 'css', 'map', 'gz', 'br', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'json'].join();
const defaultCacheControl = 'public, max-age=31536000, stale-while-revalidate=60, stale-if-error=3600';

export interface UploadAssetsToS3Flags {
   accessKeyId: string
   secretAccessKey: string
   directory: string
   bucket: string
   destination: string
   extensions: string
   'cache-control'?: string
}

export default class UploadAssetsToS3 extends Command {
   static description = ''
   static flags = {
      accessKeyId: flags.string({
         char: 's',
         description: 'AWS access key ID',
         required: true
      }),
      secretAccessKey: flags.string({
         char: 'd',
         description: 'AWS secret access key',
         required: true,
         default: ''
      }),
      directory: flags.string({
         char: 'r',
         description: 'Directory containing the assets to upload',
         required: false,
         default: defaultDirectory
      }),
      bucket: flags.string({
         char: 'b',
         description: 'Name of the S3 bucket to upload into',
         required: true,
         default: defaultBucket
      }),
      destination: flags.string({
         description: 'Name of the destination directory to upload into',
         required: true,
         default: defaultDestination
      }),
      extensions: flags.string({
         description: 'A comma delimited list of file extensions to find and upload',
         required: true,
         default: defaultFileExtensions
      }),
      'cache-control': flags.string({
         description: 'Optionally specify a cache control value',
         required: false,
         default: defaultCacheControl
      })
   }
   static args = []

   async run() {
      const { flags } = this.parse(UploadAssetsToS3)
      return uploadAssetsToS3(flags)

   }
}

const getFileType = (filename: string) => {
	// We need to know the original file type so ignore any compression
	const originalFile = filename.replace(/\.(br|gz)$/, '');
	const ext = path.extname(originalFile);

	return mime.getType(ext);
}

const getFileEncoding = (filename: string) => {
	const ext = path.extname(filename);

	switch (ext) {
		case '.gz':
			return 'gzip';
		case '.br':
			return 'br';
	}
}


const uploadFile = async (file: string, flags: UploadAssetsToS3Flags, s3: any) => {
	const basename = file.split('/').splice(1).join('/'); // remove first directory only
	const type = getFileType(basename);
	const encoding = getFileEncoding(basename);
	const key = path.posix.join(flags.destination, basename);

	const params = {
		Key: key,
		Body: fs.createReadStream(file),
		ACL: 'public-read',
		ContentType: `${type}; charset=utf-8`,
		ContentEncoding: encoding,
		CacheControl: flags['cache-control']
	};

	return new Promise<void>((resolve, reject) => {
		return s3.upload(params, (error: Error, data: any) => {
			if (error) {
				console.error(`Upload of ${basename} to ${flags.bucket} failed`); // eslint-disable-line no-console
				reject(error);
			} else {
				console.log(`Uploaded ${basename} to ${data.Location}`); // eslint-disable-line no-console
				resolve();
			}
		});
	});
}

async function uploadAssetsToS3 (flags: UploadAssetsToS3Flags) {
   const files = glob.sync(`${flags.directory}/**/*{${flags.extensions}}`);

	const s3 = new aws.S3({
		accessKeyId: flags.accessKeyId,
		secretAccessKey: flags.secretAccessKey,
		params: { Bucket: flags.bucket }
	});

	return Promise.all(files.map((file) => uploadFile(file, flags, s3)));
}