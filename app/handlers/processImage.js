'use strict';

const path = require('path');
const aws = require('aws-sdk');
const S3Stream = require('s3-upload-stream');
const gm = require('gm').subClass({ imageMagick: true });
const util = require('../util');
const config = require('../config.json');

module.exports.s3 = (event, context, callback) =>
    new aws.S3(config.s3)
        .getObject(
            {
                Bucket: event.Records[0].s3.bucket.name,
                Key: event.Records[0].s3.object.key
            },
            (err, uploadedImage) => {
                if (err) {
                    return callback(err);
                }
                gm(uploadedImage.Body)
                    .resize(config.image.width, config.image.height)
                    .autoOrient()
                    .draw([ `gravity SouthEast image Over +20,+20 200x100 "${path.dirname(__dirname)}/media/${config.image.watermark}"` ])
                    .stream('jpg', (err, composedImageStream) => {
                        if (err) {
                            return callback(err);
                        }
                        const destinationImageStream = new S3Stream(new aws.S3(config.s3))
                            .upload({
                                Bucket: config.buckets[event.Records[0].s3.bucket.name],
                                Key: event.Records[0].s3.object.key.replace(/^(.*)\.([^.]+)?$/, `$1_${util.random()}.$2`),
                                ACL: 'public-read',
                                ContentType: 'image/jpeg'
                            });
                        destinationImageStream.on('error', (err) => callback(err));
                        destinationImageStream.on('finish', () => callback());
                        composedImageStream.pipe(destinationImageStream);
                    });
            });
