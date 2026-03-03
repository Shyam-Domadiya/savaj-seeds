import express from 'express';
import {
    getBlogs,
    getBlogById,
    createBlog,
    deleteBlog,
    updateBlog,
} from '../controllers/blogController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getBlogs).post(protect, createBlog);
router
    .route('/:id')
    .get(getBlogById)
    .delete(protect, deleteBlog)
    .put(protect, updateBlog);

export default router;
