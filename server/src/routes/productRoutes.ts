import express from 'express';
import {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
} from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getProducts).post(protect, createProduct);
router
    .route('/:id')
    .get(getProductById)
    .delete(protect, deleteProduct)
    .put(protect, updateProduct);

export default router;
