'use strict';

module.exports.s3url = (bucket, key) => `http://${bucket}.s3.amazonaws.com/${key}`;

module.exports.random = () => 1000 + Math.floor(Math.random() * 9000);
