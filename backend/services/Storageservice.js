/**
 storageService.js
 
 npm install @aws-sdk/client-s3
 Set env vars: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME
 uncomment

 */

//uncomment when AWS is set up


import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function uploadImageToStorage({ screeningId, fileBuffer, mimetype, originalName, folder }) {
    const s3 = new S3Client({ 
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

     const ext = originalName.split('.').pop();
     const key = `${folder}/${screeningId}.${ext}`;
     
    await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype,
    }));

    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}