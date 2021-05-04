import { Command, flags } from '@oclif/command'
import * as fs from 'fs';
import aws from 'aws-sdk';
import isImage from 'is-image';
import path from 'path';
import mime from 'mime';
import util from 'util';
import { glob } from 'glob';
import waitForOk from '../../../wait-for-ok'
const readFile = util.promisify(fs.readFile);
const lstatSync = fs.lstatSync;
const md5File = require('md5-file');
const gzip = util.promisify(require('zlib').gzip);

interface DeployStaticOptions {
   files: string[]
}

export default class DeployStatic extends Command {
   static description = 'Deploys static <source> to S3.  Requires AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env vars'
   static flags = {
      strip: flags.integer({
         char: 's',
         description: 'Optionally strip off the <strip> leading components off of the source file name',
         required: false
      }),
      destination: flags.string({
         char: 'd',
         description: 'Optionally add a prefix to the upload path',
         required: false,
         default: ''
      }),
      region: flags.string({
         char: 'r',
         description: 'Optionally set the region (default to eu-west-1)',
         required: false,
         default: 'eu-west-1'
      }),
      bucket: flags.string({
         char: 'b',
         description: 'Optionally set the bucket (default to ft-next-qa)',
         required: false,
         default: 'ft-next-qa'
      }),
      'no-cache': flags.string({
         description: 'Optionally don\'t set a far future cache',
         required: false
      }),
      'cache-control': flags.string({
         description: 'Optionally specify a cache control value',
         required: false
      }),
      'surrogate-control': flags.string({
         description: 'Optionally specify a surrogate control value',
         required: false
      }),
      'content-type': flags.string({
         description: 'Optionally specify a content type value',
         required: false
      }),
      'acl': flags.string({
         description: 'Optionally set the Canned Access Control List for new files being put into s3 (default to public-read)',
         required: false,
         default: 'public-read'
      }),
      'monitor': flags.string({
         char: 'm',
         description: 'Optionally monitor the size of the asset',
         required: false
      }),
      'monitor-strip-directories': flags.string({
         description: 'Optionally strip all directories from the name of the metric used for monitoring',
         required: false
      }),
      'wait-for-ok': flags.string({
         char: 'w',
         description: 'Poll s3 to see if the file was uploaded ok',
         required: false
      }),
      cache: flags.boolean()
   }

   options: DeployStaticOptions = {
      files: ['**/test*.json']
   }
   
   async run() {
      const { flags } = this.parse(DeployStatic)
      const files = this.options.files.map(file => glob.sync(file))
         .flat()
         .filter(function (file) {
            return !lstatSync(file).isDirectory();
         });
      const destination = flags.destination || '';
      const bucket = flags.bucket.replace(/^https?:\/\//, '').replace(/.s3-(.*)/, '');
      
      if (files.length < 1) {
         return Promise.reject('No files found for upload to s3.  (Directories are ignored)');
      }

      // Backwards compatibility, prefer to use the standard AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY used by AWS NodeJS SDK
      if (process.env.AWS_ACCESS && process.env.AWS_SECRET) {
         aws.config.update({
            accessKeyId: process.env.AWS_ACCESS,
            secretAccessKey: process.env.AWS_SECRET
         });
      }

      const s3bucket = new aws.S3({ params: { Bucket: bucket, region: flags.region } });

      const uploadToS3 = async (file: string) => {
         const content = (isImage(file)) ? await readFile(file) : await readFile(file, { encoding: 'utf-8' });
         file = path.relative(process.cwd(), file);
         let key = file;
         const isMonitoringAsset = flags.monitor && path.extname(file) !== '.map';

         if (flags.strip) {
            key = file.split('/').splice(flags.strip).join('/');
         }

         key = path.join(destination, key);

         const s3Version = await s3bucket.headObject({ Bucket: bucket, Key: key}).promise()
            .catch(err => {
               if (err.code === 'NotFound') {
                  return { ETag: '"NotFound"' };
               }
               return Promise.reject(err);
            })
            .then(head => head && head.ETag ? head.ETag.replace(/"/g, '') : '');
         
         const localVersion = await md5File(file)

         if (s3Version === localVersion) {
            console.log(`Unchanged, skipping: ${key}`); // eslint-disable-line no-console
         } else {
            console.log(`s3/local: ${s3Version} ${localVersion}`); // eslint-disable-line no-console
            console.log(`Will upload ${file} to ${key}`); // eslint-disable-line no-console

            const payload = {
               Key: key,
               ContentType: flags['content-type'] ? flags['content-type'] : mime.getType(file) || null,
               ACL: flags.acl,
               Body: content,
               CacheControl: flags['cache-control'] || (flags.cache ? 'public, max-age=31536000' : undefined),
               Bucket: bucket
            };

            if (flags['surrogate-control']) {
               // @ts-ignore
               payload.Metadata = {
                  'Surrogate-Control': flags['surrogate-control']
               };
            }
               
            if (payload.ContentType === 'text/javascript' || payload.ContentType === 'text/css') {
               payload.ContentType += '; charset=utf-8';
            }

            // @ts-ignore
             s3bucket.upload(payload).promise()
               .then(() => {
                  if (flags['wait-for-ok']) {
                     return waitForOk(`http://${bucket}.s3-${flags.region}.amazonaws.com/${key}`);
                  }
               })
               .then(() => isMonitoringAsset ? gzip(content) : Promise.resolve())
               .then(gzipped => {
                  if (!isMonitoringAsset) {
                     return;
                  }
                  // @ts-ignore
                  const contentSize = Buffer.byteLength(content);
                  const gzippedContentSize = Buffer.byteLength(gzipped);
                  console.log(`${key} is ${contentSize} bytes (${gzippedContentSize} bytes gzipped)`); // eslint-disable-line no-console
               });
               console.log(`Successfully uploaded: ${key}`); // eslint-disable-line no-console
         }
      }

      return Promise.all(files.map(file => {
         return uploadToS3(file);
      }))
   }
}