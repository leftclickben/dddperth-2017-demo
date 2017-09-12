'use strict';

const aws = require('aws-sdk');
const util = require('../util');
const config = require('../config.json');

module.exports.s3 = (event, context, callback) =>
    new aws.SES(config.ses)
        .sendEmail(
            {
                Source: config.notification.sender,
                Destination: {
                    ToAddresses: config.notification.recipients
                },
                Message: {
                    Body: {
                        Text: {
                            Charset: 'UTF-8',
                            Data: config.notification.body.replace('%url%', util.s3url(event.Records[0].s3.bucket.name, event.Records[0].s3.object.key))
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: config.notification.subject
                    }
                }
            },
            (err) => callback(err));
