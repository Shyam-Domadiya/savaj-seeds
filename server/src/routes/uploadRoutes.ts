import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Cloudinary Storage engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (_req, file) => {
        // Extract original file name without extension
        const originalName = path.parse(file.originalname).name;
        // Clean up name: remove spaces and special characters
        const cleanName = originalName.replace(/[^a-zA-Z0-9]/g, '-');
        // Add unique suffix
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

        return {
            folder: 'savaj-seeds/products',
            format: 'webp', // Automatically convert to WebP for better performance
            public_id: `${cleanName}-${uniqueSuffix}`,
            transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Resize if too large
        };
    },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit is usually enough for cloud
});

// POST /api/upload
router.post('/', upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }

    // req.file.path contains the secure Cloudinary URL (e.g. https://res.cloudinary.com/...)
    const imageUrl = req.file.path;
    res.json({ url: imageUrl });
});

// Multer error handler
router.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(413).json({ message: 'File too large. Maximum allowed size is 10MB.' });
            return;
        }
        res.status(400).json({ message: err.message });
        return;
    }
    if (err) {
        res.status(400).json({ message: err.message || 'Upload failed' });
        return;
    }
    _next();
});

export default router;
