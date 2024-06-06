const config = require("./config");
const { S3Client } = require("@aws-sdk/client-s3");

const region = config.BUCKET_REGION;
const accessKeyId = config.ACCESS_KEY;
const secretAccessKey = config.SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

module.exports = { s3Client };
