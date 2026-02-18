import express from 'express';
import { submitContactForm, getContacts } from '../controllers/contactController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(submitContactForm).get(protect, getContacts);

export default router;
