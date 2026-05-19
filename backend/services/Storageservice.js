/**
 storageService.js
 
 npm install @aws-sdk/client-s3
 Set env vars: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME
 uncomment

 */

//uncomment when AWS is set up


import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function getS3Client() {
    return new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
}

export async function uploadImageToStorage({ screeningId, fileBuffer, mimetype, originalName, folder }) {
     const ext = originalName.split('.').pop();
     const key = `${folder}/${screeningId}.${ext}`;
     
    await getS3Client().send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype,
    }));

    return key;
}

export async function getPresignedUrl(key) {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    });
    return await getSignedUrl(getS3Client(), command, { expiresIn: 3600 }); // URL valid for 1 hour
}