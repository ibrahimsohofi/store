import multer from 'multer';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../../../config/env.js';

const s3Client = new S3Client({
  region: env.AWS_REGION || 'auto',
  endpoint: env.S3_ENDPOINT || 'https://r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

export const uploadService = {
  async processAndUploadImage(file, folder = 'products') {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.mimetype.split('/')[1];
      const filename = `${folder}/${timestamp}-${randomString}.${extension}`;

      // Process image with sharp
      const processedImage = await sharp(file.buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Generate thumbnail
      const thumbnail = await sharp(file.buffer)
        .resize(300, 300, {
          fit: 'cover',
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      // Upload main image to S3
      const mainKey = filename;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: mainKey,
          Body: processedImage,
          ContentType: file.mimetype,
        })
      );

      // Upload thumbnail to S3
      const thumbKey = `${folder}/thumbs/${timestamp}-${randomString}.${extension}`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: thumbKey,
          Body: thumbnail,
          ContentType: file.mimetype,
        })
      );

      // Return URLs
      const baseUrl = env.S3_PUBLIC_URL || `https://${env.S3_BUCKET}.r2.dev`;
      
      return {
        originalUrl: `${baseUrl}/${mainKey}`,
        thumbnailUrl: `${baseUrl}/${thumbKey}`,
        key: mainKey,
        thumbnailKey: thumbKey,
      };
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  },

  async deleteImage(key) {
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: key,
        })
      );
    } catch (error) {
      console.error('Image deletion error:', error);
      throw new Error('Failed to delete image');
    }
  },
};
