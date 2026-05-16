/**
 storageService.js
 
 npm install @aws-sdk/client-s3
 Set env vars: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME
 uncomment

 */

//uncomment when AWS is set up

/*
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function uploadImageToStorage({ screeningID, fileBuffer, mimetype, originalName }) {
     const ext = originalName.split('.').pop();
     const key = `retinal_images/${screeningID}.${ext}`;
     
    await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype,
        ACL: 'public-read', // Make the file publicly readable
    }));

    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
*/

//-- MOCK(active)

export async function uploadImageToStorage({ screeningID}) {
    console.log('[storageService] Mock upload for screeningID:', screeningID);
    return `https://mockstorage.local/retinal_images/${screeningID}.jpg`;
}