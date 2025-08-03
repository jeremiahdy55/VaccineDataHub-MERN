import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Upon calling uploadToS3, when given a blob of a .pdf and the filename
// create a pdf that is the representation of the blob and store it in the bucket
export const uploadToS3 = async (blob, filename) => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    Bucket: process.env.AWS_S3BUCKET_NAME,
    Key: filename,
    Body: blob,
    ContentType: "application/pdf",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
};

// upon receiving a filename of a correct appointment, generate a presigned url
// for the client to use to download the PDF
export const getPresignedURL = async (filename) => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const params = {
    Bucket: process.env.AWS_S3BUCKET_NAME,
    Key: filename,
  };
  const command = new GetObjectCommand(params);
  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  }); // 5 mins
  return presignedUrl;
};
