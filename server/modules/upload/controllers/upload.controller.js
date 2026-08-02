import { upload, uploadService } from '../services/upload.service.js';

export const uploadController = {
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: {
            code: 'NO_FILE',
            message: 'No file uploaded',
          },
        });
      }

      const result = await uploadService.processAndUploadImage(req.file, req.body.folder || 'products');

      res.json({
        data: result,
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        error: {
          code: 'UPLOAD_ERROR',
          message: error.message,
        },
      });
    }
  },
};

export const uploadMiddleware = upload.single('image');
