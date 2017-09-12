'use strict';

const aws = require('aws-sdk');
const util = require('../util');
const config = require('../config.json');

module.exports.get = (event, context, callback) =>
    new aws.S3(config.s3)
        .listObjectsV2(
            {
                Bucket: event.stageVariables.imagesBucket
            },
            (err, data) => err ?
                callback(err) :
                callback(undefined, {
                    statusCode: 200,
                    body: JSON.stringify(data.Contents.map((object) => ({
                        url: util.s3url(event.stageVariables.imagesBucket, object.Key),
                        size: object.Size
                    })))
                }));
