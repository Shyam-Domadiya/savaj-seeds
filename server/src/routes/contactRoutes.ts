import express from 'express';
import { submitContactForm, getContacts, markContactAsRead } from '../controllers/contactController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(submitContactForm).get(protect, getContacts);
router.route('/:id/read').put(protect, markContactAsRead);

export default router;
